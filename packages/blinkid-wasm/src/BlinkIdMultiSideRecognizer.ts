/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import { BlinkIdSingleSideRecognizerSettings } from "./BlinkIdSingleSideRecognizer";
import { Recognizer } from "./Recognizer";
import { BlinkIdMultiSideRecognizerResult } from "./BlinkIdResult";

// Declare a constructable class, but keep it private, as it's only used as a type
export declare class BlinkIdMultiSideRecognizer extends Recognizer<
  BlinkIdMultiSideRecognizerSettings,
  BlinkIdMultiSideRecognizerResult
> {}

/**
 * A settings object that is used for configuring the BlinkIdMultiSideRecognizer.
 */
export interface BlinkIdMultiSideRecognizerSettings
  extends BlinkIdSingleSideRecognizerSettings {
  /**
   * Proceed to scan the back side of a document even if some of the validity checks have failed while scanning the
   * front side of a document.
   *
   * IMPORTANT: only works for photo frames, not video frames.
   */
  allowUncertainFrontSideScan: boolean;

  /**
   * Configure the number of characters per field that are allowed to be inconsistent in data match.
   */
  maxAllowedMismatchesPerField: number;

  /**
   * Back side of the document will not be scanned if only the front side is supported for a specific document.
   *
   * If set to false, a photo of the back side will be returned, as well as barcode or MRZ (Machine Readable Zone) if
   * either is present.
   */
  skipUnsupportedBack: boolean;
}
