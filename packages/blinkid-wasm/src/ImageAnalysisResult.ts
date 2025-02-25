/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import { CardRotation } from "./CardRotation";
import { CardOrientation } from "./CardOrientation";
import { ImageAnalysisDetectionStatus } from "./ImageAnalysisDetectionStatus";
import { DocumentImageColorStatus } from "./DocumentImageColorStatus";

export interface ImageAnalysisResult {
  /**
   * Indicates if blur was detected on the scanned image.
   */
  blurDetected: boolean;

  /**
   * Indicates if glare was detected on the scanned image.
   */
  glareDetected: boolean;

  /**
   * Orientation of the card detected on the scanned image.
   */
  cardOrientation: CardOrientation;

  /**
   * The color status determined from scanned image.
   */
  documentImageColorStatus: DocumentImageColorStatus;

  /**
   * The Moire pattern detection status determined from the scanned image.
   */
  documentImageMoireStatus: ImageAnalysisDetectionStatus;

  /**
   * Face detection status determined from the scanned image.
   */
  faceDetectionStatus: ImageAnalysisDetectionStatus;

  /**
   * Mrz detection status determined from the scanned image.
   */
  mrzDetectionStatus: ImageAnalysisDetectionStatus;

  /**
   * Barcode detection status determined from the scanned image.
   */
  barcodeDetectionStatus: ImageAnalysisDetectionStatus;

  /**
   * RealID detection status determined from the scanned image.
   */
  realIDDetectionStatus: ImageAnalysisDetectionStatus;

  /**
   * Rotation of the card detected on the scanned image.
   */
  cardRotation?: CardRotation;
}
