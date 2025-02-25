/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import { ImageOrientation } from "./ImageOrientation";

export interface CameraFrameResult {
  /**
   * Contains both original image and JPEG-encoded bytes of the image.
   */
  frame: ImageData | null;

  /** Orientation of the captured frame */
  orientation: ImageOrientation;
}
