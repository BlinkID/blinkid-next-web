/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

/**
 * RecognitionMode enum defines possible recognition modes for BlinkID Single-side and BlinkID Multi-side recognizers.
 */

export enum RecognitionMode {
  /** No recognition performed. */
  None,

  /** Recognition of mrz document (does not include visa and passport) */
  MrzId,

  /** Recognition of visa mrz. */
  MrzVisa,

  /** Recognition of passport mrz. */
  MrzPassport,

  /** Recognition of documents that have face photo on the front. */
  PhotoId,

  /** Detailed document recognition. */
  FullRecognition,

  /** Recognition of barcode document. */
  BarcodeId,

  /** Number of possible values */
  Count,
}
