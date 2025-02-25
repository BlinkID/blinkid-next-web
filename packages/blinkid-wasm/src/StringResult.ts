/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import { Rectangle } from "./Rectangle";
import { DocumentSide } from "./DocumentSide";

/**
 * Multi-script string result structure.
 */

export interface StringResult {
  arabic?: string;
  cyrillic?: string;
  latin?: string;

  arabicLocation?: Rectangle;
  cyrillicLocation?: Rectangle;
  latinLocation?: Rectangle;

  arabicSide?: DocumentSide;
  cyrillicSide?: DocumentSide;
  latinSide?: DocumentSide;
}
