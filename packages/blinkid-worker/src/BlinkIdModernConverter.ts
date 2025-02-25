/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import {
  DetectionStatus,
  DisplayableQuad,
  ProcessingStatus,
  RecognizerResultState,
} from "@microblink/blinkid-wasm";
import { CaptureState, FrameAnalysisResult } from "./FrameAnalysisResult";
import { getImageAnalysisResult } from "./utils";
import { BlinkIdResult } from "./BlinkIdResult";

export class BlinkIdModernConverter {
  // these are public for testing purposes
  barcodeScanningInProgress = false;
  sideCapturedEmmited = false;

  reset() {
    this.barcodeScanningInProgress = false;
    this.sideCapturedEmmited = false;
  }

  convertToFrameResult(
    recognizerResult: BlinkIdResult,
    detectionStatus: DetectionStatus,
    quad?: DisplayableQuad,
  ) {
    const recognizerResultState = recognizerResult.state;
    const processingStatus = recognizerResult.processingStatus;
    const imageAnalysisResult = getImageAnalysisResult(recognizerResult);

    // Default to "capture in progress"-like state
    let captureState: CaptureState;

    if ("scanningFirstSideDone" in recognizerResult) {
      if (!recognizerResult.scanningFirstSideDone) {
        captureState = "first-side-capture-in-progress";
      } else {
        captureState = "second-side-capture-in-progress";
      }
    } else {
      captureState = "first-side-capture-in-progress";
    }

    const frameAnalysisResult: FrameAnalysisResult = {
      captureState,
      frameAnalysisStatus: {
        // Initialize with fail state, populate later
        framingStatus: "no-document",
        quad,
      },
      processingStatus,
    };

    if (recognizerResultState === RecognizerResultState.Empty) {
      // no-op
    }

    if (recognizerResultState === RecognizerResultState.Uncertain) {
      // no-op
    }

    if (this.barcodeScanningInProgress) {
      frameAnalysisResult.captureState = "barcode-scanning-in-progress";
    }

    if (
      recognizerResultState === RecognizerResultState.StageValid &&
      !this.sideCapturedEmmited // we want this event to trigger only once
    ) {
      // Also results in ProcessingStatus.AwaitingOtherSide
      // Can check on "scanningFirstSideDone" in recognizerResult

      frameAnalysisResult.captureState = "side-captured";
      this.sideCapturedEmmited = true;

      // In case barcode is on front
      this.barcodeScanningInProgress = false;
    }

    if (recognizerResultState === RecognizerResultState.Valid) {
      frameAnalysisResult.captureState = "document-captured";
      // this.#resetInternalState(); // TODO: DO WE WANT THIS?
    }

    // FramingStatus
    if (detectionStatus === DetectionStatus.Success) {
      frameAnalysisResult.frameAnalysisStatus.framingStatus = "ok";
    }

    if (detectionStatus === DetectionStatus.Failed) {
      frameAnalysisResult.frameAnalysisStatus.framingStatus = "no-document";
    }

    if (detectionStatus === DetectionStatus.DocumentTooCloseToCameraEdge) {
      frameAnalysisResult.frameAnalysisStatus.framingStatus =
        "document-too-close-to-frame-edge";
    }

    if (detectionStatus === DetectionStatus.CameraTooFar) {
      frameAnalysisResult.frameAnalysisStatus.framingStatus = "camera-too-far";
    }

    if (detectionStatus === DetectionStatus.CameraTooClose) {
      frameAnalysisResult.frameAnalysisStatus.framingStatus =
        "camera-too-close";
    }

    if (detectionStatus === DetectionStatus.CameraAngleTooSteep) {
      frameAnalysisResult.frameAnalysisStatus.framingStatus =
        "camera-angle-too-steep";
    }

    if (detectionStatus === DetectionStatus.DocumentPartiallyVisible) {
      frameAnalysisResult.frameAnalysisStatus.framingStatus =
        "document-not-fully-visible";
    }

    // Mandatory field missing = document not fully visible
    if (processingStatus === ProcessingStatus.MandatoryFieldMissing) {
      frameAnalysisResult.frameAnalysisStatus.framingStatus =
        "document-not-fully-visible";
    }

    // blur & glare

    frameAnalysisResult.frameAnalysisStatus.blurDetected =
      imageAnalysisResult.blurDetected;

    frameAnalysisResult.frameAnalysisStatus.glareDetected =
      imageAnalysisResult.glareDetected;

    // Low quality input
    if (
      processingStatus === ProcessingStatus.ImagePreprocessingFailed &&
      detectionStatus === DetectionStatus.Failed
    ) {
      frameAnalysisResult.frameAnalysisStatus.lowQualityInput = true;
    }

    // Scanning wrong side
    frameAnalysisResult.frameAnalysisStatus.scanningWrongSide =
      processingStatus === ProcessingStatus.ScanningWrongSide;

    return frameAnalysisResult;
  }
}
