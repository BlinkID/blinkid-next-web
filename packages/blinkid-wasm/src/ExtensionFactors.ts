/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

/**
 * Extension factors relative to corresponding dimension of the full image. For example,
 * {@code upFactor} and {@code downFactor} define extensions relative to image height, e.g.
 * when {@code upFactor} is 0.5, upper image boundary will be extended for half of image's full
 * height.
 */

export interface ExtensionFactors {
  /**
   * Currently used image extension factor relative to full image height in UP direction.
   */
  upFactor: number;

  /**
   * Currently used image extension factor relative to full image height in DOWN direction.
   */
  downFactor: number;

  /**
   * Currently used image extension factor relative to full image height in LEFT direction.
   */
  leftFactor: number;

  /**
   * Currently used image extension factor relative to full image height in RIGHT direction.
   */
  rightFactor: number;
}
