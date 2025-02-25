/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

export * from "./BlinkIdCore";
export * from "./createCustomImageData";
export * from "./createProxyWorker";
export * from "./getCrossOriginWorkerURL";
export * from "./getUserId";

// export everything because we use enums
export * from "@microblink/blinkid-wasm";

// we can export types only
export type {
  ActiveRecognizer,
  BlinkIdWorkerInitSettings,
  BlinkIdWorkerProxy,
  CaptureState,
  BlinkIdResult,
  DocumentFramingStatus,
  FrameAnalysisResult,
  FrameAnalysisStatus,
} from "@microblink/blinkid-worker";

// https://newsletter.daishikato.com/p/detecting-dual-module-issues-in-jotai

const testSymbol = Symbol();

declare global {
  /* eslint-disable no-var */
  var __BLINKID_CORE__: typeof testSymbol;
}

globalThis.__BLINKID_CORE__ ||= testSymbol;
if (globalThis.__BLINKID_CORE__ !== testSymbol) {
  console.warn(
    "Detected multiple instances of @microblink/blinkid-core. This can lead to unexpected behavior.",
  );
}
