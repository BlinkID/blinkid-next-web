/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import { linkResources } from "@microblink/utils";
import dns from "node:dns";
import path from "node:path";
import { createRequire } from "node:module";
import { ServerOptions, defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert";
import solidPlugin from "vite-plugin-solid";
import { fs } from "zx";

const require = createRequire(import.meta.url);

// https://vitejs.dev/guide/migration.html#architecture-changes-and-legacy-options
dns.setDefaultResultOrder("verbatim");

const serverOptions: ServerOptions = {
  port: 3000,
  // host: true,
  headers: {
    "Cross-Origin-Embedder-Policy": "require-corp",
    "Cross-Origin-Opener-Policy": "same-origin",
  },
};

export default defineConfig((config) => {
  return {
    build: {
      sourcemap: config.mode === "development",
      target: "es2022",
    },
    plugins: [
      {
        name: "move-resources",
        buildStart: async () => {
          if (ranOnce) {
            return;
          }
          console.log();
          moveResources();
          ranOnce = true;
        },
      },
      solidPlugin(),
      // Generates certificates for https
      mkcert(),
    ],
    server: serverOptions,
    preview: serverOptions,
  };
});

let ranOnce = false;

async function moveResources() {
  const packageRoot = path.dirname(
    require.resolve("@microblink/blinkid-core/package.json"),
  );

  console.log(packageRoot);
  const resourcesPath = `${packageRoot}/dist/resources`;
  const files = fs.readdirSync(resourcesPath);

  fs.ensureDirSync(`public/resources`);

  for (const path of files) {
    await linkResources(`${resourcesPath}/${path}`, `public/resources/${path}`);
  }
}
