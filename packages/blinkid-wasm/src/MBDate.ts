/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

/**
 * Specifies a date object, as parsed from some documents.
 * Unlike JavaScript Date object, it does not depend on time zone.
 */

export interface MBDate {
  /** Day in month. */
  day: number;

  /** Month in year. */
  month: number;

  /** Year */
  year: number;

  /** Original string on the document from which date was parsed. */
  originalString: string;

  /** Indicates whether date was parsed successfully. */
  successfullyParsed: boolean;

  /** Indicates whether object is empty. Note that it is possible to successfully parse an empty date. */
  empty: boolean;
}
