/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import { ClassFilter } from "./ClassFilter";
import { DetailedFieldType } from "./DetailedFieldType";

export interface CustomClassRules {
  /**
   * Specified fields will overrule our class field rules if filter conditions are met.
   */
  classFilter: ClassFilter;

  /**
   * Fields to overrule our class field rules.
   */
  fields: DetailedFieldType[];
}
