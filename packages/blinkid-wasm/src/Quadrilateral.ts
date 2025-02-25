/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import { Point } from "./Point";

/**
 * Interface representing a quadrilateral
 */

export interface Quadrilateral {
  /** Top-left point of the quadrilateral */
  topLeft: Point;

  /** Top-right point of the quadrilateral */
  topRight: Point;

  /** Bottom-left point of the quadrilateral */
  bottomLeft: Point;

  /** Bottom-right point of the quadrilateral */
  bottomRight: Point;
}
