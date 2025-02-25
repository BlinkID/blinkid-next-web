import { Simplify } from "type-fest";
import { PackageJsonData, writePackage } from "write-package";
import "zx/globals";

import { getPackagePath } from "@microblink/utils";
import packageJson from "../package.json";

type PackageKeys = keyof typeof packageJson;
type KeyArray = Simplify<PackageKeys>[];

const publishPath = path.resolve("publish");
const newPackagePath = path.join(publishPath, "package.json");

const pickKeys = (properties: KeyArray) => {
  const corePackageJson = properties.reduce((acc, key) => {
    acc[key] = packageJson[key];
    return acc;
  }, {});
  return corePackageJson;
};

const corePackageJson = pickKeys([
  "name",
  "version",
  "author",
  "type",
  "main",
  "module",
  "description",
  "files",
]);

await fs.emptyDir(publishPath);

await fs.copy("dist", path.join(publishPath, "dist"));
await fs.copy("types", path.join(publishPath, "types"));

// Since monorepo dependencies resolve to the version "workspace:*", we need
// to resolve the actual versions of the dependencies before publishing the
// package.

const microblinkDependencies = Object.keys(packageJson.dependencies).filter(
  (key) => key.startsWith("@microblink"),
);

const mbDepsWithVersion = microblinkDependencies.reduce<
  NonNullable<PackageJsonData["dependencies"]>
>((acc, key) => {
  const pkgPath = getPackagePath(key);
  const pkgJson = fs.readJsonSync(path.join(pkgPath, "package.json"));
  acc[key] = `^${pkgJson.version}`;
  return acc;
}, {});

await writePackage(
  newPackagePath,
  {
    ...corePackageJson,
    dependencies: mbDepsWithVersion,
    access: "public",
    registry: "https://registry.npmjs.org/",
    types: "./types/index.rollup.d.ts",
    exports: {
      ".": {
        types: "./types/index.rollup.d.ts",
        import: "./dist/blinkid-next.js",
      },
      "./package.json": "./package.json",
    },
  } as PackageJsonData,
  {
    normalize: true,
    indent: 2,
  },
);
