/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import { StringResult } from "./StringResult";

/**
 * Smart date result structure.
 */
export interface DateResult {
  day?: number;
  month?: number;
  year?: number;
  originalString?: StringResult;
  successfullyParsed?: boolean;
  filledByDomainKnowledge?: boolean;
  empty?: boolean;
}
