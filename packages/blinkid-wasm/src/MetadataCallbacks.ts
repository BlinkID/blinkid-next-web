/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

/**
 * Interface representing possible events that can occur during image processing.
 * All functions in this interface are optional and will be called only if they are
 * implemented.
 */

import { DisplayablePoints, DisplayableQuad } from "./Displayable";

export interface MetadataCallbacks {
  /**
   * Called when recognition process wants to display some debug text information.
   * @param debugTest Debug text information to be displayed.
   */
  onDebugText?(debugTest: string): void;

  /**
   * Called when all recognizers in RecognizerRunner have failed to detect anything on the image.
   */
  onDetectionFailed?(): void;

  /**
   * Called when recognition process wants to display some quadrilateral.
   * @param quad Quadrilateral to be displayed.
   */
  onQuadDetection?(quad: DisplayableQuad): void;

  /**
   * Called when recognition process wants to display some points.
   * @param pointSet Points to be displayed.
   */
  onPointsDetection?(pointSet: DisplayablePoints): void;

  /**
   * Called when first side recognition with the multi-side recognizer completes.
   */
  onFirstSideResult?(): void;
}
