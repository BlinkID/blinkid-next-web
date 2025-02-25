/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

export interface ImageResult {
  /**
   * Contains the original image that can be drawn to canvas.
   */
  rawImage: ImageData | null;

  /**
   * Contains the JPEG-encoded bytes of the image.
   */
  encodedImage: Uint8Array | null;
}
