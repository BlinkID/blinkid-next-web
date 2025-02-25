/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import { CaptureState } from "@microblink/blinkid-core";
import { expect, test } from "vitest";
import { getUiStateKeyFromFrameResult } from "./blinkid-ui-state";

test("Searching for front side", () => {
  expect(
    getUiStateKeyFromFrameResult({
      captureState: "first-side-capture-in-progress",
      frameAnalysisStatus: {
        framingStatus: "no-document",
        blurDetected: false,
        glareDetected: false,
      },
    }),
  ).toBe("SENSING_FRONT");
});

test("Searching for back side", () => {
  expect(
    getUiStateKeyFromFrameResult({
      captureState: "second-side-capture-in-progress",
      frameAnalysisStatus: {
        framingStatus: "no-document",
        blurDetected: false,
        glareDetected: false,
      },
    }),
  ).toBe("SENSING_BACK");
});

test("Fail due to image preprocessing on front", () => {
  expect(
    getUiStateKeyFromFrameResult({
      captureState: "first-side-capture-in-progress",
      frameAnalysisStatus: {
        framingStatus: "no-document",
        lowQualityInput: true,
        blurDetected: false,
        glareDetected: false,
      },
    }),
  ).toBe("LOW_QUALITY_FRONT");
});

test("Fail due to image preprocessing on back", () => {
  expect(
    getUiStateKeyFromFrameResult({
      captureState: "second-side-capture-in-progress",
      frameAnalysisStatus: {
        framingStatus: "no-document",
        lowQualityInput: true,
        blurDetected: false,
        glareDetected: false,
      },
    }),
  ).toBe("LOW_QUALITY_BACK");
});

test("Fail due to image occlusion on front", () => {
  expect(
    getUiStateKeyFromFrameResult({
      captureState: "first-side-capture-in-progress",
      frameAnalysisStatus: {
        framingStatus: "document-not-fully-visible",
        lowQualityInput: false,
        blurDetected: false,
        glareDetected: false,
      },
    }),
  ).toBe("OCCLUDED");
});

test("Wrong side on back", () => {
  expect(
    getUiStateKeyFromFrameResult({
      captureState: "second-side-capture-in-progress",
      frameAnalysisStatus: { scanningWrongSide: true, framingStatus: "ok" },
    }),
  ).toBe("WRONG_SIDE");
});

test("Wrong side on front", () => {
  expect(
    getUiStateKeyFromFrameResult({
      captureState: "second-side-capture-in-progress",
      frameAnalysisStatus: { scanningWrongSide: true, framingStatus: "ok" },
    }),
  ).toBe("WRONG_SIDE");
});

// processing front
test("Front processing", () => {
  expect(
    getUiStateKeyFromFrameResult({
      captureState: "first-side-capture-in-progress",
      frameAnalysisStatus: { framingStatus: "ok" },
    }),
  ).toBe("PROCESSING");
});

// processing back
test("Back processing", () => {
  expect(
    getUiStateKeyFromFrameResult({
      captureState: "second-side-capture-in-progress",
      frameAnalysisStatus: { framingStatus: "ok" },
    }),
  ).toBe("PROCESSING");
});

// blur
test("Blur detected", () => {
  expect(
    getUiStateKeyFromFrameResult({
      captureState: "second-side-capture-in-progress",
      frameAnalysisStatus: { blurDetected: true, framingStatus: "ok" },
    }),
  ).toBe("BLUR_DETECTED");
});

// glare
test("Glare detected", () => {
  expect(
    getUiStateKeyFromFrameResult({
      captureState: "second-side-capture-in-progress",
      frameAnalysisStatus: { glareDetected: true, framingStatus: "ok" },
    }),
  ).toBe("GLARE_DETECTED");
});

// allow document capture with blur
test("Capture document with blur if allowed", () => {
  expect(
    getUiStateKeyFromFrameResult({
      captureState: "document-captured",
      frameAnalysisStatus: { blurDetected: true, framingStatus: "ok" },
    }),
  ).toBe("DOCUMENT_CAPTURED");
});

// allow side capture with blur
test("Capture side with blur if allowed", () => {
  expect(
    getUiStateKeyFromFrameResult({
      captureState: "side-captured",
      frameAnalysisStatus: { blurDetected: true, framingStatus: "ok" },
    }),
  ).toBe("SIDE_CAPTURED");
});

test("Document captured", () => {
  expect(
    getUiStateKeyFromFrameResult({
      captureState: "document-captured",
      frameAnalysisStatus: { framingStatus: "ok" },
    }),
  ).toBe("DOCUMENT_CAPTURED");
});

test("Side captured", () => {
  expect(
    getUiStateKeyFromFrameResult({
      captureState: "side-captured",
      frameAnalysisStatus: { framingStatus: "ok" },
    }),
  ).toBe("SIDE_CAPTURED");
});

test("Fallback resolves to SENSING_FRONT", () => {
  expect(
    getUiStateKeyFromFrameResult({
      captureState: "asdf" as CaptureState,
      frameAnalysisStatus: { framingStatus: "ok" },
    }),
  ).toBe("SENSING_FRONT");
});
