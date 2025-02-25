/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import { ImageOrientation } from "./ImageOrientation";

/**
 * Represents a captured frame from HTMLVideoElement.
 */

export interface CapturedFrame {
  /** Instance of ImageData object - contains pixels and metadata about the captured image. */
  imageData: ImageData;

  /** Orientation of the captured frame */
  orientation: ImageOrientation;

  /** Indicates whether captured frame originated from still image or video stream. */
  videoFrame: boolean;
}
