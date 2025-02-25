/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import { DisplayableQuad, ProcessingStatus } from "@microblink/blinkid-wasm";

export type FrameAnalysisResult = {
  captureState: CaptureState;
  frameAnalysisStatus: FrameAnalysisStatus;
  // basically debug info
  processingStatus: ProcessingStatus;
};

export type FrameAnalysisStatus = {
  framingStatus: DocumentFramingStatus;
  // these are optional if there is no document
  blurDetected?: boolean;
  glareDetected?: boolean;
  scanningWrongSide?: boolean;
  lowQualityInput?: boolean;
  quad?: DisplayableQuad;
};

export type CaptureState =
  | "side-captured"
  | "document-captured"
  | "first-side-capture-in-progress"
  | "second-side-capture-in-progress"
  | "barcode-scanning-in-progress";

/**
 *  The document framing status for the current frame.
 */
export type DocumentFramingStatus =
  | "no-document"
  | "camera-too-far"
  | "camera-too-close"
  | "camera-angle-too-steep"
  | "document-too-close-to-frame-edge"
  | "document-not-fully-visible"
  | "ok";
