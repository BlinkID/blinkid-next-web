/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

/**
 * Specifies the state of the recognition result.
 */

export enum RecognizerResultState {
  /** Nothing has been recognized. */
  Empty,
  /** Something has been recognized, but some mandatory data is still missing. */
  Uncertain,
  /** All required data has been recognized. */
  Valid,
  /** Single stage of a multi-stage recognition is finished. */
  StageValid,
}
