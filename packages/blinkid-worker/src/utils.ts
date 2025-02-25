/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import { BlinkIdResult } from "./BlinkIdResult";

export function convertEmscriptenStatusToProgress(status: string): number {
  // roughly based on https://github.com/emscripten-core/emscripten/blob/1.39.11/src/shell.html#L1259
  if (status === "Running...") {
    // download has completed, wasm execution has started
    return 100;
  } else if (status.length === 0) {
    // empty message
    return 0;
  }

  const regExp = RegExp(/([^(]+)\((\d+(\.\d+)?)\/(\d+)\)/);
  const match = regExp.exec(status);
  if (match) {
    const currentValue = parseInt(match[2]);
    const maxValue = parseInt(match[4]);
    return (currentValue * 100) / maxValue;
  } else {
    // Cannot parse emscripten status
    return NaN;
  }
}

export function isMultiside(result: BlinkIdResult): boolean {
  return "scanningFirstSideDone" in result;
}

/**
 * Get the image analysis result from the BlinkIdResult.
 */
export function getImageAnalysisResult(result: BlinkIdResult) {
  const isMultiside = "scanningFirstSideDone" in result;

  const imageAnalysisResult = (() => {
    if (isMultiside) {
      return !result.scanningFirstSideDone
        ? result.frontImageAnalysisResult
        : result.backImageAnalysisResult;
    }

    return result.imageAnalysisResult;
  })();

  return imageAnalysisResult;
}

/**
 * Get the additional processing information from the BlinkIdResult.
 * @param result
 * @returns
 */
export function getAdditionalProcessingInfo(result: BlinkIdResult) {
  const isMultiside = "scanningFirstSideDone" in result;

  const additionalProcessingInfo = (() => {
    if (isMultiside) {
      return !result.scanningFirstSideDone
        ? result.frontAdditionalProcessingInfo
        : result.backAdditionalProcessingInfo;
    }

    return result.additionalProcessingInfo;
  })();

  return additionalProcessingInfo;
}

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
