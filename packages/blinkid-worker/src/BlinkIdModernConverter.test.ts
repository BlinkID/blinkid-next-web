/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import {
  DetectionStatus,
  ProcessingStatus,
  RecognizerResultState,
} from "@microblink/blinkid-wasm";
import { beforeEach, expect, test } from "vitest";
import { BlinkIdModernConverter } from "./BlinkIdModernConverter";
import { FrameAnalysisResult } from "./FrameAnalysisResult";
import {
  BlinkIdMultiSideRecognizerResultSubset,
  emptyMultisideResult,
} from "./examples/emptyMultisideResult";

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

/**
 * Used temporarily as processing status was added after the tests were written
 */
type FrameAnalysisResultWithoutProcessingStatus = Omit<
  FrameAnalysisResult,
  "processingStatus"
>;

const converter = new BlinkIdModernConverter();

beforeEach(() => {
  converter.reset();
});

/**
 * Helper method to create a copy of the empty result with modifications
 */
function createBlinkIdMultiSideResultCopy(
  modifications?: DeepPartial<BlinkIdMultiSideRecognizerResultSubset>,
) {
  const blinkIdResultCopy = structuredClone(emptyMultisideResult);
  const blinkIdResult = Object.assign(blinkIdResultCopy, modifications);

  const sideOrDocumentCaptured =
    blinkIdResult.state === RecognizerResultState.StageValid ||
    blinkIdResult.state === RecognizerResultState.Valid;

  if (sideOrDocumentCaptured && !blinkIdResult.scanningFirstSideDone) {
    throw new Error("Invalid state");
  }

  return blinkIdResult;
}

// Test init and reset
test("Initial values", () => {
  expect(converter.barcodeScanningInProgress).toBe(false);
  expect(converter.sideCapturedEmmited).toBe(false);
});

test("Reset", () => {
  converter.barcodeScanningInProgress = true;
  converter.sideCapturedEmmited = true;
  converter.reset();
  expect(converter.barcodeScanningInProgress).toBe(false);
  expect(converter.sideCapturedEmmited).toBe(false);
});

test("Starting capture on second side works", () => {
  converter.sideCapturedEmmited = true;
  expect(converter.sideCapturedEmmited).toBe(true);
});

test("State can't be Valid or StageValid without scanningFirstSideDone", () => {
  expect(() =>
    createBlinkIdMultiSideResultCopy({
      state: RecognizerResultState.Valid,
    }),
  ).toThrowError("Invalid state");

  expect(() =>
    createBlinkIdMultiSideResultCopy({
      state: RecognizerResultState.StageValid,
    }),
  ).toThrowError("Invalid state");
});

// Capture states

test("Waiting for the document to get in frame", () => {
  const frameResult = converter.convertToFrameResult(
    createBlinkIdMultiSideResultCopy(),
    DetectionStatus.Failed,
  );
  expect(frameResult).toMatchObject<FrameAnalysisResultWithoutProcessingStatus>(
    {
      captureState: "first-side-capture-in-progress",
      frameAnalysisStatus: { framingStatus: "no-document" },
    },
  );
});

test("Second side captured", () => {
  const frameResult = converter.convertToFrameResult(
    createBlinkIdMultiSideResultCopy({
      state: RecognizerResultState.StageValid,
      scanningFirstSideDone: true,
    }),
    DetectionStatus.Success,
  );

  expect(frameResult).toMatchObject<FrameAnalysisResultWithoutProcessingStatus>(
    {
      captureState: "side-captured",
      frameAnalysisStatus: { framingStatus: "ok" },
    },
  );
});

test("side-captured is emmited only once", () => {
  const secondSideFrame = createBlinkIdMultiSideResultCopy({
    scanningFirstSideDone: true,
    state: RecognizerResultState.StageValid,
  });

  // feed once
  let frameResult = converter.convertToFrameResult(
    secondSideFrame,
    DetectionStatus.Success,
  );

  expect(frameResult).toMatchObject<FrameAnalysisResultWithoutProcessingStatus>(
    {
      captureState: "side-captured",
      frameAnalysisStatus: { framingStatus: "ok" },
    },
  );

  // feed again
  frameResult = converter.convertToFrameResult(
    secondSideFrame,
    DetectionStatus.Success,
  );

  expect(frameResult).toMatchObject<FrameAnalysisResultWithoutProcessingStatus>(
    {
      captureState: "second-side-capture-in-progress",
      frameAnalysisStatus: { framingStatus: "ok" },
    },
  );
});

test("Scanning second side, no document", () => {
  converter.sideCapturedEmmited = true;
  const frameResult = converter.convertToFrameResult(
    createBlinkIdMultiSideResultCopy({
      state: RecognizerResultState.StageValid,
      scanningFirstSideDone: true,
    }),
    DetectionStatus.Failed,
  );

  expect(frameResult).toMatchObject<FrameAnalysisResultWithoutProcessingStatus>(
    {
      captureState: "second-side-capture-in-progress",
      frameAnalysisStatus: { framingStatus: "no-document" },
    },
  );
});

test("Document captured", () => {
  const frameResult = converter.convertToFrameResult(
    createBlinkIdMultiSideResultCopy({
      state: RecognizerResultState.Valid,
      scanningFirstSideDone: true,
    }),
    DetectionStatus.Success,
  );

  expect(frameResult).toMatchObject<FrameAnalysisResultWithoutProcessingStatus>(
    {
      captureState: "document-captured",
      frameAnalysisStatus: { framingStatus: "ok" },
    },
  );
});

test("document-captured can be emitted multiple times", () => {
  const firstSideFrame = createBlinkIdMultiSideResultCopy({
    scanningFirstSideDone: true,
    state: RecognizerResultState.Valid,
  });

  // feed once
  let frameResult = converter.convertToFrameResult(
    firstSideFrame,
    DetectionStatus.Success,
  );

  expect(frameResult).toMatchObject<FrameAnalysisResultWithoutProcessingStatus>(
    {
      captureState: "document-captured",
      frameAnalysisStatus: { framingStatus: "ok" },
    },
  );

  // feed again
  frameResult = converter.convertToFrameResult(
    firstSideFrame,
    DetectionStatus.Success,
  );

  expect(frameResult).toMatchObject<FrameAnalysisResultWithoutProcessingStatus>(
    {
      captureState: "document-captured",
      frameAnalysisStatus: { framingStatus: "ok" },
    },
  );
});

test("Document successfuly framed on second side", () => {
  converter.sideCapturedEmmited = true;
  const frameResult = converter.convertToFrameResult(
    createBlinkIdMultiSideResultCopy({
      state: RecognizerResultState.StageValid,
      scanningFirstSideDone: true,
    }),
    DetectionStatus.Success,
  );

  expect(frameResult).toMatchObject<FrameAnalysisResultWithoutProcessingStatus>(
    {
      captureState: "second-side-capture-in-progress",
      frameAnalysisStatus: { framingStatus: "ok" },
    },
  );
});

test("Barcode scanning in progress", () => {
  converter.barcodeScanningInProgress = true;
  const frameResult = converter.convertToFrameResult(
    createBlinkIdMultiSideResultCopy(),
    DetectionStatus.Failed,
  );

  expect(frameResult).toMatchObject<FrameAnalysisResultWithoutProcessingStatus>(
    {
      captureState: "barcode-scanning-in-progress",
      frameAnalysisStatus: { framingStatus: "no-document" },
    },
  );
});

// Detection status to framing status

test("Too close to edge", () => {
  const frameResult = converter.convertToFrameResult(
    createBlinkIdMultiSideResultCopy(),
    DetectionStatus.DocumentTooCloseToCameraEdge,
  );

  expect(frameResult).toMatchObject<FrameAnalysisResultWithoutProcessingStatus>(
    {
      captureState: "first-side-capture-in-progress",
      frameAnalysisStatus: {
        framingStatus: "document-too-close-to-frame-edge",
      },
    },
  );
});

test("Camera too far", () => {
  const frameResult = converter.convertToFrameResult(
    createBlinkIdMultiSideResultCopy(),
    DetectionStatus.CameraTooFar,
  );

  expect(frameResult).toMatchObject<FrameAnalysisResultWithoutProcessingStatus>(
    {
      captureState: "first-side-capture-in-progress",
      frameAnalysisStatus: { framingStatus: "camera-too-far" },
    },
  );
});

test("Camera too close", () => {
  const frameResult = converter.convertToFrameResult(
    createBlinkIdMultiSideResultCopy(),
    DetectionStatus.CameraTooClose,
  );

  expect(frameResult).toMatchObject<FrameAnalysisResultWithoutProcessingStatus>(
    {
      captureState: "first-side-capture-in-progress",
      frameAnalysisStatus: { framingStatus: "camera-too-close" },
    },
  );
});

test("Recording angle too steep", () => {
  const frameResult = converter.convertToFrameResult(
    createBlinkIdMultiSideResultCopy(),
    DetectionStatus.CameraAngleTooSteep,
  );

  expect(frameResult).toMatchObject<FrameAnalysisResultWithoutProcessingStatus>(
    {
      captureState: "first-side-capture-in-progress",
      frameAnalysisStatus: { framingStatus: "camera-angle-too-steep" },
    },
  );
});

test("Only blur detected", () => {
  const frameResult = converter.convertToFrameResult(
    createBlinkIdMultiSideResultCopy({
      frontImageAnalysisResult: {
        blurDetected: true,
      },
    }),
    DetectionStatus.Success,
  );

  expect(frameResult).toMatchObject<FrameAnalysisResultWithoutProcessingStatus>(
    {
      captureState: "first-side-capture-in-progress",
      frameAnalysisStatus: { blurDetected: true, framingStatus: "ok" },
    },
  );
});

test("Only glare detected", () => {
  const frameResult = converter.convertToFrameResult(
    createBlinkIdMultiSideResultCopy({
      frontImageAnalysisResult: {
        glareDetected: true,
      },
    }),
    DetectionStatus.Success,
  );

  expect(frameResult).toMatchObject<FrameAnalysisResultWithoutProcessingStatus>(
    {
      captureState: "first-side-capture-in-progress",
      frameAnalysisStatus: { glareDetected: true, framingStatus: "ok" },
    },
  );
});

test("Blur with no document", () => {
  const frameResult = converter.convertToFrameResult(
    createBlinkIdMultiSideResultCopy({
      frontImageAnalysisResult: {
        blurDetected: true,
      },
    }),
    DetectionStatus.Failed,
  );

  expect(frameResult).toMatchObject<FrameAnalysisResultWithoutProcessingStatus>(
    {
      captureState: "first-side-capture-in-progress",
      frameAnalysisStatus: { blurDetected: true, framingStatus: "no-document" },
    },
  );
});

test("Low image quality", () => {
  const frameResult = converter.convertToFrameResult(
    createBlinkIdMultiSideResultCopy({
      processingStatus: ProcessingStatus.ImagePreprocessingFailed,
      scanningFirstSideDone: false,
    }),
    DetectionStatus.Failed,
  );

  expect(frameResult).toMatchObject<FrameAnalysisResultWithoutProcessingStatus>(
    {
      captureState: "first-side-capture-in-progress",
      frameAnalysisStatus: {
        framingStatus: "no-document",
        lowQualityInput: true,
      },
    },
  );
});

test("Scanning wrong side (on back)", () => {
  const frameResult = converter.convertToFrameResult(
    createBlinkIdMultiSideResultCopy({
      scanningFirstSideDone: true,
      processingStatus: ProcessingStatus.ScanningWrongSide,
    }),
    DetectionStatus.Success,
  );

  expect(frameResult).toMatchObject<FrameAnalysisResultWithoutProcessingStatus>(
    {
      captureState: "second-side-capture-in-progress",
      frameAnalysisStatus: { framingStatus: "ok", scanningWrongSide: true },
    },
  );
});

test("Scanning wrong side (on front)", () => {
  const frameResult = converter.convertToFrameResult(
    createBlinkIdMultiSideResultCopy({
      processingStatus: ProcessingStatus.ScanningWrongSide,
    }),
    DetectionStatus.Success,
  );

  expect(frameResult).toMatchObject<FrameAnalysisResultWithoutProcessingStatus>(
    {
      captureState: "first-side-capture-in-progress",
      frameAnalysisStatus: { framingStatus: "ok", scanningWrongSide: true },
    },
  );
});

// Occlusion
// TODO: figure out if ScanPolicy impacts this
// https://bitbucket.org/microblink/core-blinkid-generic-recognizer/src/main/BlinkIDGenericRecognizer/Include/BlinkIDGenericRecognizer/Settings/ScanPolicy.hpp
test("Document partially visible", () => {
  const frameResult = converter.convertToFrameResult(
    createBlinkIdMultiSideResultCopy(),
    DetectionStatus.DocumentPartiallyVisible,
  );

  expect(frameResult).toMatchObject<FrameAnalysisResultWithoutProcessingStatus>(
    {
      captureState: "first-side-capture-in-progress",
      frameAnalysisStatus: {
        framingStatus: "document-not-fully-visible",
      },
    },
  );
});
