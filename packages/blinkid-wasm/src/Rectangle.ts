/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import { Point } from "./Point";

export interface Rectangle {
  /** Top-left point of the rectangle */
  topLeft: Point;

  /** Bottom-right point of the rectangle */
  bottomRight: Point;
}
