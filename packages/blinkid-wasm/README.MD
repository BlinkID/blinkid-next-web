# BlinkID Wasm

The `@microblink/blinkid-wasm` package contains types for the BlinkID WebAssembly resources compiled by Emscripten. This includes the BlinkID code exposed via C++ bindings and the supporting Emscripten code.

In future versions, the `/resources` directory will be a part of this repository, but in the prerelease `@next` version these currently match the ones present in [`@microblink/blinkid-in-browser-sdk`](https://github.com/BlinkID/blinkid-in-browser/tree/master/resources).

This package is not published on npm, but only provides type info to [`@microblink/blinkid-worker`](../blinkid-worker/README.MD) and [`@microblink/blinkid-core`](../blinkid-core/README.MD), which is the published npm package.
