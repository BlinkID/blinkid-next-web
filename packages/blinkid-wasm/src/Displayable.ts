/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import { DetectionStatus } from "./DetectionStatus";
import { Point } from "./Point";
import { Quadrilateral } from "./Quadrilateral";

/**
 * Interface representing any displayable object.
 */

export interface Displayable {
  /** Detection status of the displayable object. */
  detectionStatus: DetectionStatus;

  /**
   * 3x3 transformation matrix from the image's coordinate system to view's coordinate system.
   */
  transformMatrix: Float32Array;
}

/**
 * Interface representing quadrilateral in image.
 */
export interface DisplayableQuad extends Displayable, Quadrilateral {}

/**
 * Interface representing list of points in image.
 */
export interface DisplayablePoints extends Displayable {
  /** Array of points */
  points: Point[];
}
