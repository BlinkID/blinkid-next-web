/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import { FrameAnalysisResult } from "@microblink/blinkid-core";
import { UiState } from "@microblink/feedback-stabilizer";
import { match } from "ts-pattern";

export type BlinkIdReticleType =
  | "searching"
  | "processing"
  | "error"
  | "done"
  | "flip";

export type BlinkIdUiStateKey =
  | "PROCESSING"
  | "SIDE_CAPTURED"
  | "DOCUMENT_CAPTURED"
  | "SENSING_FRONT"
  | "SENSING_BACK"
  | "LOW_QUALITY_FRONT"
  | "LOW_QUALITY_BACK"
  | "DOCUMENT_FRAMING_CAMERA_TOO_FAR"
  | "DOCUMENT_FRAMING_CAMERA_TOO_CLOSE"
  | "DOCUMENT_FRAMING_CAMERA_ANGLE_TOO_STEEP"
  | "DOCUMENT_TOO_CLOSE_TO_FRAME_EDGE"
  | "BLUR_DETECTED"
  | "GLARE_DETECTED"
  | "OCCLUDED"
  | "SCAN_BARCODE"
  | "WRONG_SIDE";

/**
 * Extended UI state for BlinkID.
 */

export type BlinkIdUiStateMap = {
  [K in BlinkIdUiStateKey]: UiState & {
    key: K;
    reticleType: BlinkIdReticleType;
  };
};

export type BlinkIdUiState = BlinkIdUiStateMap[keyof BlinkIdUiStateMap];

export const blinkIdUiStateMap: BlinkIdUiStateMap = {
  PROCESSING: {
    key: "PROCESSING",
    reticleType: "processing",
    minDuration: 1000,
  },
  SCAN_BARCODE: {
    key: "SCAN_BARCODE",
    reticleType: "processing",
    minDuration: 1000,
  },
  SIDE_CAPTURED: {
    key: "SIDE_CAPTURED",
    reticleType: "flip",
    minDuration: 2000,
    singleEmit: true,
  },
  DOCUMENT_CAPTURED: {
    key: "DOCUMENT_CAPTURED",
    reticleType: "done",
    minDuration: 1000,
    singleEmit: true,
  },
  LOW_QUALITY_FRONT: {
    key: "LOW_QUALITY_FRONT",
    reticleType: "searching",
    minDuration: 1000,
  },
  LOW_QUALITY_BACK: {
    key: "LOW_QUALITY_BACK",
    reticleType: "searching",
    minDuration: 1000,
  },
  SENSING_FRONT: {
    key: "SENSING_FRONT",
    reticleType: "searching",
    minDuration: 1000,
  },
  SENSING_BACK: {
    key: "SENSING_BACK",
    reticleType: "searching",
    minDuration: 1000,
  },
  DOCUMENT_FRAMING_CAMERA_TOO_FAR: {
    key: "DOCUMENT_FRAMING_CAMERA_TOO_FAR",
    reticleType: "error",
    minDuration: 1500,
  },
  DOCUMENT_FRAMING_CAMERA_TOO_CLOSE: {
    key: "DOCUMENT_FRAMING_CAMERA_TOO_CLOSE",
    reticleType: "error",
    minDuration: 1500,
  },
  DOCUMENT_FRAMING_CAMERA_ANGLE_TOO_STEEP: {
    key: "DOCUMENT_FRAMING_CAMERA_ANGLE_TOO_STEEP",
    reticleType: "error",
    minDuration: 1500,
  },
  DOCUMENT_TOO_CLOSE_TO_FRAME_EDGE: {
    key: "DOCUMENT_TOO_CLOSE_TO_FRAME_EDGE",
    reticleType: "error",
    minDuration: 1500,
  },
  BLUR_DETECTED: {
    key: "BLUR_DETECTED",
    reticleType: "error",
    minDuration: 1500,
  },
  GLARE_DETECTED: {
    key: "GLARE_DETECTED",
    reticleType: "error",
    minDuration: 1500,
  },
  OCCLUDED: {
    key: "OCCLUDED",
    reticleType: "error",
    minDuration: 1500,
  },
  WRONG_SIDE: {
    key: "WRONG_SIDE",
    reticleType: "error",
    minDuration: 1500,
  },
} as const;

/**
 * Used temporarily as processing status was added after the tests were written
 */
export type FrameAnalysisResultWithoutProcessingStatus = Omit<
  FrameAnalysisResult,
  "processingStatus"
>;

export function getUiStateKeyFromFrameResult(
  frameAnalysisResult: FrameAnalysisResultWithoutProcessingStatus,
) {
  return (
    match<FrameAnalysisResultWithoutProcessingStatus, BlinkIdUiStateKey>(
      frameAnalysisResult,
    )
      // Unique states
      .with(
        {
          captureState: "document-captured",
        },
        () => "DOCUMENT_CAPTURED",
      )
      .with(
        {
          captureState: "side-captured",
        },
        () => "SIDE_CAPTURED",
      )
      .with(
        {
          captureState: "first-side-capture-in-progress",
          frameAnalysisStatus: {
            framingStatus: "no-document",
            lowQualityInput: true,
            blurDetected: false,
            glareDetected: false,
          },
        },
        () => "LOW_QUALITY_FRONT",
      )
      .with(
        {
          captureState: "second-side-capture-in-progress",
          frameAnalysisStatus: {
            framingStatus: "no-document",
            lowQualityInput: true,
            blurDetected: false,
            glareDetected: false,
          },
        },
        () => "LOW_QUALITY_BACK",
      )
      .with(
        {
          captureState: "first-side-capture-in-progress",
          frameAnalysisStatus: {
            framingStatus: "no-document",
            blurDetected: false,
            glareDetected: false,
          },
        },
        () => "SENSING_FRONT",
      )
      .with(
        {
          captureState: "second-side-capture-in-progress",
          frameAnalysisStatus: {
            framingStatus: "no-document",
            blurDetected: false,
            glareDetected: false,
          },
        },
        () => "SENSING_BACK",
      )
      .with(
        {
          frameAnalysisStatus: {
            scanningWrongSide: true,
          },
        },
        () => "WRONG_SIDE",
      )
      .with(
        {
          captureState: "barcode-scanning-in-progress",
        },
        () => "SCAN_BARCODE",
      )
      // framing
      .with(
        {
          frameAnalysisStatus: {
            framingStatus: "camera-angle-too-steep",
          },
        },
        () => "DOCUMENT_FRAMING_CAMERA_ANGLE_TOO_STEEP",
      )
      .with(
        {
          frameAnalysisStatus: {
            framingStatus: "camera-too-close",
          },
        },
        () => "DOCUMENT_FRAMING_CAMERA_TOO_CLOSE",
      )
      .with(
        {
          frameAnalysisStatus: {
            framingStatus: "camera-too-far",
          },
        },
        () => "DOCUMENT_FRAMING_CAMERA_TOO_FAR",
      )
      .with(
        {
          frameAnalysisStatus: {
            framingStatus: "document-too-close-to-frame-edge",
          },
        },
        () => "DOCUMENT_TOO_CLOSE_TO_FRAME_EDGE",
      )

      // occlusion
      .with(
        {
          frameAnalysisStatus: {
            blurDetected: true,
          },
        },
        () => "BLUR_DETECTED",
      )
      .with(
        {
          frameAnalysisStatus: {
            glareDetected: true,
          },
        },
        () => "GLARE_DETECTED",
      )
      .with(
        {
          frameAnalysisStatus: {
            framingStatus: "document-not-fully-visible",
          },
        },
        () => "OCCLUDED",
      )
      .with(
        {
          captureState: "first-side-capture-in-progress",
          frameAnalysisStatus: {
            framingStatus: "ok",
          },
        },
        () => "PROCESSING",
      )
      .with(
        {
          captureState: "second-side-capture-in-progress",
          frameAnalysisStatus: {
            framingStatus: "ok",
          },
        },
        () => "PROCESSING",
      )
      // fallback
      .otherwise(() => "SENSING_FRONT")
  );
}
