/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import { BlinkIdMultiSideRecognizer } from "./BlinkIdMultiSideRecognizer";
import { BlinkIdSingleSideRecognizer } from "./BlinkIdSingleSideRecognizer";
import { EmbindObject } from "./EmbindObject";
import { MetadataCallbacks } from "./MetadataCallbacks";
import { CapturedFrame } from "./CapturedFrame";
import { RecognizerResultState } from "./RecognizerResultState";

export type BlinkIdRecognizer =
  | BlinkIdSingleSideRecognizer
  | BlinkIdMultiSideRecognizer;

export declare class RecognizerRunner extends EmbindObject {
  constructor(
    recognizers: Array<BlinkIdRecognizer>,
    allowMultipleResults: boolean,
    metadataCallbacks: MetadataCallbacks,
  );

  reconfigureRecognizers: (
    recognizers: Array<BlinkIdRecognizer>,
    allowMultipleResults: boolean,
  ) => void;
  resetRecognizers: (resetBothSides: boolean) => void;
  processImage: (image: CapturedFrame) => RecognizerResultState;
  setJSDelegate: (metadataCallbacks: MetadataCallbacks) => void;
  setDetectionOnlyMode: (detectionOnly: boolean) => void;
  setCameraPreviewMirrored: (mirrored: boolean) => void;
  setPingProxyUrl: (url: string) => void;
}
