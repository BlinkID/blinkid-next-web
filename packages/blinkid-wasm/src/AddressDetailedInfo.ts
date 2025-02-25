/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

/**
 * Detailed information about the address.
 */

export interface AddressDetailedInfo {
  /** The address street portion of the document owner. */
  street: string;

  /** The address postal code portion of the document owner. */
  postalCode: string;

  /** The address city portion of the document owner. */
  city: string;

  /** The address jurisdiction code portion of the document owner. */
  jurisdiction: string;
}
