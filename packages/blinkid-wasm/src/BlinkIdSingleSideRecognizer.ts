/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import { Recognizer } from "./Recognizer";
import { AnonymizationMode } from "./AnonymizationMode";
import { RecognitionModeFilter } from "./RecognitionModeFilter";
import { StrictnessLevel } from "./StrictnessLevel";
import { RecognizerImageOptions } from "./image-options";
import { ClassInfo } from "./ClassInfo";
import { BlinkIdSingleSideRecognizerResult } from "./BlinkIdResult";
import { CustomClassRules } from "./CustomClassRules";
import { ClassAnonymizationSettings } from "./ClassAnonymizationSettings";

// Declare a constructable class, but keep it private, as it's only used as a type
export declare class BlinkIdSingleSideRecognizer extends Recognizer<
  BlinkIdSingleSideRecognizerSettings,
  BlinkIdSingleSideRecognizerResult
> {}

/**
 * A settings object that is used for configuring the BlinkIdSingleSideRecognizer.
 */
export interface BlinkIdSingleSideRecognizerSettings
  extends RecognizerImageOptions {
  /**
   * Skip processing of blurred frames.
   */
  enableBlurFilter: boolean;

  /**
   * Skip processing of frames which contain too much glare.
   */
  enableGlareFilter: boolean;

  /**
   * Strictness level for blur detection.
   */
  blurStrictnessLevel: StrictnessLevel;

  /**
   * Strictness level for glare detection.
   */
  glareStrictnessLevel: StrictnessLevel;

  /**
   * Allow reading of non-standard MRZ (Machine Readable Zone). Only raw MRZ result is returned.
   * Final recognizer state is not affected.
   */
  allowUnparsedMrzResults: boolean;

  /**
   * Allows barcode recognition to proceed even if the initial extraction fails
   * @defaultValue false
   */
  allowBarcodeScanOnly: boolean;

  /**
   * Enables the aggregation of data from multiple frames
   * @defaultValue true
   */
  combineFrameResults: boolean;

  /**
   * Allow reading of standard MRZ (Machine Readable Zone) which gets successfully parsed, but check digits are
   * incorrect (do not comply with the ICAO standard).
   *
   * Final recognizer state is not affected.
   */
  allowUnverifiedMrzResults: boolean;

  /**
   * Enable or disable recognition of specific document groups supported by the current license.
   * By default all modes are enabled.
   */
  recognitionModeFilter: RecognitionModeFilter;

  /**
   * Save the raw camera frames at the moment of the data extraction or timeout.
   * This significantly increases memory consumption. The scanning performance is not affected.
   */
  saveCameraFrames: boolean;

  /**
   * Process only cropped document images with corrected perspective (frontal images of a document).
   * This only applies to still images - video feed will ignore this setting.
   */
  scanCroppedDocumentImage: boolean;

  /**
   * Allow only results containing expected characters for a given field.
   *
   * Each field is validated against a set of rules.
   *
   * All fields have to be successfully validated in order for a recognizer state to be ‘valid’.
   * Setting is used to improve scanning accuracy.
   */
  validateResultCharacters: boolean;

  /**
   * Redact specific fields based on requirements or laws regarding a specific document.
   *
   * Data can be redacted from the image, the result or both.
   *
   * The setting applies to certain documents only.
   */
  anonymizationMode: AnonymizationMode;

  /**
   * Redact fields for specific document class.
   *
   * Fields specified by requirements or laws for a specific document will be redacted regardless of this setting.
   *
   * Based on anonymizationMode setting, data will be redacted from the image, the result or both.
   */
  additionalAnonymization?: Array<ClassAnonymizationSettings>;

  /**
   * Define custom rules for specific document class.
   *
   * The new class rules will be a combination of our internal and user-defined rules.
   *
   * The more detailed class filter will have priority over the other.
   */
  customClassRules: Array<CustomClassRules> | null;

  /**
   * Called when barcode scanning step starts.
   */
  barcodeScanningStartedCallback?: () => void;

  /**
   * Called when recognizer classifies a document.
   */
  classifierCallback?: (isDocumentSupported: boolean) => void;

  /**
   * If not defined, all supported documents will be recognized.
   * Otherwise, only classes from given array will be recognized and all other
   * documents will be treated as "not supported" (observable via classifierCallback).
   */
  allowedDocumentClasses?: Array<ClassInfo>;

  /**
   * Minimum required distance between the edge of the scanning frame and the document.
   *
   * Defined as a percentage of the frame width.
   *
   * Default value is 0.0f in which case the padding edge and the image edge are the same.
   * Alternative recommended value is 0.02f.
   */
  paddingEdge: number;
}
