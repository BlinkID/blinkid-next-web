/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

/**
 *  ImageAnalysisDetectionStatus enum defines possible states of specific image object detection.
 */

export enum ImageAnalysisDetectionStatus {
  /** Detection was not performed */
  NotAvailable,

  /** Object not detected on input image */
  NotDetected,

  /** Object detected on input image */
  Detected,
}
