/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import { MBDate } from "./MBDate";

/**
 * Supported MRTD document types
 */
export enum MrtdDocumentType {
  MRTD_TYPE_UNKNOWN,
  /** Identity card */
  MRTD_TYPE_IDENITY_CARD,
  /** Passport */
  MRTD_TYPE_PASSPORT,
  /** Visa */
  MRTD_TYPE_VISA,
  /** US Green Card */
  MRTD_TYPE_GREEN_CARD,
  /** Malaysian PASS type IMM13P */
  MRTD_TYPE_MYS_PASS_IMM13P,
  /** Driver's license */
  MRTD_TYPE_DL,
  /** Internal travel document */
  MRTD_TYPE_INTERNAL_TRAVEL_DOCUMENT,
  /** Border crossing card */
  MRTD_TYPE_BORDER_CROSSING_CARD,
  /** Number of elements in this enum */
  MRTD_TYPE_COUNT,
}
/**
 * Represents data extracted from MRZ (Machine Readable Zone) of Machine Readable Travel Document (MRTD).
 */
export interface MrzResult {
  /**
   * The alien number. Contains empty string if not available.
   * Exists only on US Green Cards. To see which document was scanned use {@link documentType}.
   */
  alienNumber: string;

  /**
   * The application receipt number. Contains empty string if not available.
   * Exists only on US Green Cards. To see which document was scanned use {@link documentType}.
   */
  applicationReceiptNumber: string;

  /**
   * The holder's date of birth
   */
  dateOfBirth: MBDate;

  /**
   * The date of expiry
   */
  dateOfExpiry: MBDate;

  /**
   * The document code. Document code contains two characters. For MRTD the first character shall
   * be A, C or I. The second character shall be discretion of the issuing State or organization except
   * that V shall not be used, and `C` shall not be used after `A` except in the crew member certificate.
   * On machine-readable passports (MRP) first character shall be `P` to designate an MRP. One additional
   * letter may be used, at the discretion of the issuing State or organization, to designate a particular
   * MRP. If the second character position is not used for this purpose, it shall be filled by the filter
   * character <code>&lt;</code>.
   */
  documentCode: string;

  /**
   * The document number. Document number contains up to 9 characters.
   * Element does not exist on US Green Card. To see which document was scanned use {@link documentType}.
   */
  documentNumber: string;

  /**
   * The MRTD document type of recognized document.
   */
  documentType: MrtdDocumentType;

  /**
   * The gender of the card holder. Gender is specified by use of the single initial, capital letter F for female,
   * M for male or <code>&lt;</code> for unspecified.
   */
  gender: string;

  /**
   * The immigrant case number. Contains empty string if not available.
   * Exists only on US Green Cards. To see which document was scanned use {@link #documentType}.
   */
  immigrantCaseNumber: string;

  /**
   * The three-letter or two-letter code which indicate the issuing State. Three-letter codes are based
   * on Aplha-3 codes for entities specified in ISO 3166-1, with extensions for certain States. Two-letter
   * codes are based on Aplha-2 codes for entities specified in ISO 3166-1, with extensions for certain States.
   */
  issuer: string;

  /**
   * The full issuer name that is expanded from the three-letter or two-letter code which indicate
   * the issuing State.
   */
  issuerName: string;

  /**
   * Returns nationality of the holder represented by a three-letter or two-letter code. Three-letter
   * codes are based on Alpha-3 codes for entities specified in ISO 3166-1, with extensions for certain
   * States. Two-letter codes are based on Aplha-2 codes for entities specified in ISO 3166-1, with
   * extensions for certain States.
   */
  nationality: string;

  /**
   * Full nationality of the holder, which is expanded from the three-letter or two-letter
   * nationality code.
   */
  nationalityName: string;

  /**
   * The first optional data. Contains empty string if not available.
   * Element does not exist on US Green Card. To see which document was scanned use {@link #documentType}.
   */
  opt1: string;

  /**
   * The second optional data. Contains empty string if not available.
   * Element does not exist on Passports and Visas. To see which document was scanned use {@link #documentType}.
   */
  opt2: string;

  /**
   * true if Machine Readable Zone has been parsed, false otherwise.
   */
  parsed: boolean;

  /**
   * The primary indentifier. If there is more than one component, they are separated with space.
   */
  primaryID: string;

  /**
   * The entire Machine Readable Zone text from ID. This text is usually used for parsing
   * other elements.
   * NOTE: This string is available only if OCR result was parsed successfully.
   */
  rawMRZString: string;

  /**
   * The document code, but without additional '<' characters if they exist.
   *
   * @see #documentCode
   */
  sanitizedDocumentCode: string;

  /**
   * The document number, but without additional '<' characters if they exist.
   *
   * @see #documentNumber
   */
  sanitizedDocumentNumber: string;

  /**
   * The issuer, but without additional '<' characters if they exist.
   *
   * @see #issuer
   */
  sanitizedIssuer: string;

  /**
   * The nationality, but without additional '<' characters if they exist.
   *
   * @see #nationality
   */
  sanitizedNationality: string;

  /**
   * The opt1 field, but without additional '<' characters if they exist.
   *
   * @see #opt1
   */
  sanitizedOpt1: string;

  /**
   * The opt2 field, but without additional '<' characters if they exist.
   *
   * @see #opt2
   */
  sanitizedOpt2: string;

  /**
   * The secondary identifier. If there is more than one component, they are separated with space.
   */
  secondaryID: string;

  /**
   * True if all check digits inside MRZ are correct, false otherwise.
   */
  verified: boolean;
}
