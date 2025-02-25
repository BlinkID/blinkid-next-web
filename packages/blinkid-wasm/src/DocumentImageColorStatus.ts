/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

/**
 * DocumentImageColorStatus enum defines possible color statuses determined from scanned image.
 */

export enum DocumentImageColorStatus {
  /** Determining image color status was not performed */
  NotAvailable,

  /** Black-and-white image scanned */
  BlackAndWhite,

  /** Color image scanned */
  Color,
}
