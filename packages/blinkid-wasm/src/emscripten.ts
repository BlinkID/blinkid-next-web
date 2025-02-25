/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

// emscripten-types.ts

// WebAssembly types for compatibility
export interface WebAssemblyModule {}

export type EnvironmentType = "WEB" | "NODE" | "SHELL" | "WORKER";

export interface CCallOpts {
  async?: boolean | undefined;
}

// Main EmscriptenModule interface
export interface EmscriptenModule {
  print(str: string): void;
  printErr(str: string): void;
  arguments: string[];
  environment: EnvironmentType;
  preInit: Array<{ (): void }>;
  preRun: Array<{ (): void }>;
  postRun: Array<{ (): void }>;
  onAbort: { (what: any): void };
  onRuntimeInitialized: { (): void };
  preinitializedWebGLContext: WebGLRenderingContext;
  noInitialRun: boolean;
  noExitRuntime: boolean;
  logReadFiles: boolean;
  filePackagePrefixURL: string;
  wasmBinary: ArrayBuffer;

  // Missing types:
  // https://emscripten.org/docs/api_reference/module.html#Module.mainScriptUrlOrBlob
  mainScriptUrlOrBlob?: string;
  // for logging progress
  // https://emscripten.org/docs/api_reference/emscripten.h.html#c.emscripten_push_uncounted_main_loop_blocker
  setStatus: (text: string) => void;

  destroy(object: object): void;
  getPreloadedPackage(
    remotePackageName: string,
    remotePackageSize: number,
  ): ArrayBuffer;
  instantiateWasm(
    imports: WebAssembly.Imports,
    successCallback: (module: WebAssembly.Instance) => void,
  ): WebAssembly.Exports | undefined;
  locateFile(url: string, scriptDirectory: string): string;
  onCustomMessage(event: MessageEvent): void;

  // USE_TYPED_ARRAYS == 1
  HEAP: Int32Array;
  IHEAP: Int32Array;
  FHEAP: Float64Array;

  // USE_TYPED_ARRAYS == 2
  HEAP8: Int8Array;
  HEAP16: Int16Array;
  HEAP32: Int32Array;
  HEAPU8: Uint8Array;
  HEAPU16: Uint16Array;
  HEAPU32: Uint32Array;
  HEAPF32: Float32Array;
  HEAPF64: Float64Array;
  HEAP64: BigInt64Array;
  HEAPU64: BigUint64Array;

  TOTAL_STACK: number;
  TOTAL_MEMORY: number;
  FAST_MEMORY: number;

  addOnPreRun(cb: () => any): void;
  addOnInit(cb: () => any): void;
  addOnPreMain(cb: () => any): void;
  addOnExit(cb: () => any): void;
  addOnPostRun(cb: () => any): void;

  preloadedImages: any;
  preloadedAudios: any;

  _malloc(size: number): number;
  _free(ptr: number): void;
}

/**
 * A factory function is generated when setting the `MODULARIZE` build option
 * to `1` in your Emscripten build. It return a Promise that resolves to an
 * initialized, ready-to-call `EmscriptenModule` instance.
 *
 * By default, the factory function will be named `Module`. It's recommended to
 * use the `EXPORT_ES6` option, in which the factory function will be the
 * default export. If used without `EXPORT_ES6`, the factory function will be a
 * global variable. You can rename the variable using the `EXPORT_NAME` build
 * option. It's left to you to declare any global variables as needed in your
 * application's types.
 * @param moduleOverrides Default properties for the initialized module.
 */
export type EmscriptenModuleFactory<
  T extends EmscriptenModule = EmscriptenModule,
> = (moduleOverrides?: Partial<T>) => Promise<T>;
