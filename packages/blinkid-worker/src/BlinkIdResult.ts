/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import {
  BlinkIdSingleSideRecognizerResult,
  BlinkIdMultiSideRecognizerResult,
} from "@microblink/blinkid-wasm";

export type BlinkIdResult =
  | BlinkIdSingleSideRecognizerResult
  | BlinkIdMultiSideRecognizerResult;
