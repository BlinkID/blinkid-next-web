/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

// Export all types

import {
  BlinkIdWasmModule,
  EmscriptenModuleFactory,
} from "@microblink/blinkid-wasm";

export type * from "./BlinkIdResult";
export type * from "./FrameAnalysisResult";

export type {
  BlinkIdWorkerProxy,
  ActiveRecognizer,
  BlinkIdWorkerInitSettings,
} from "./BlinkIdWorker";

// build as a side-effect
import "./BlinkIdWorker";

declare global {
  interface WorkerGlobalScope {
    BlinkIDWasmSDK: EmscriptenModuleFactory<BlinkIdWasmModule>;
  }
}
