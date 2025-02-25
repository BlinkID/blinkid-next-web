import "zx/globals";
import path from "node:path";

const packageName = "@microblink/blinkid-next/resources";

// Use Node's module resolution to find the package

if (!import.meta.resolve) {
  throw new Error("import.meta.resolve is not supported in this environment");
}

const packageMainPath = await import.meta.resolve(packageName);

const packageRoot = path.dirname(new URL(packageMainPath).pathname);

console.log("Resources path:", packageRoot);
