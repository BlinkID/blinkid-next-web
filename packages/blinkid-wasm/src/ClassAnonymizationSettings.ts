/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import { ClassFilter } from "./ClassFilter";
import { DocumentNumberAnonymizationSettings } from "./DocumentNumberAnonymizationSettings";
import { FieldType } from "./FieldType";

export declare class ClassAnonymizationSettings {
  classFilter: ClassFilter;
  /**
   * Fields to be anonymized.
   */
  fields: Array<FieldType>;
  /**
   * Anonymization settings for a document number.
   */
  documentNumberAnonymizationSettings: DocumentNumberAnonymizationSettings | null;
}
