/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import { DriverLicenseDetailedInfo } from "./DriverLicenseDetailedInfo";
import { StringResult } from "./StringResult";
import { DateResult } from "./DateResult";

import { DependentInfo } from "./DependentInfo";

/**
 * VIZResult contains data extracted from the Visual Inspection Zone.
 */
export interface VIZResult {
  /** The first name of the document owner. */
  firstName: StringResult;
  /** The last name of the document owner. */
  lastName: StringResult;
  /** The full name of the document owner. */
  fullName: StringResult;
  /** The additional name information of the document owner. */
  additionalNameInformation: StringResult;
  /** The localized name of the document owner. */
  localizedName: StringResult;
  /** The fathers name of the document owner. */
  fathersName: StringResult;
  /** The mothers name of the document owner. */
  mothersName: StringResult;

  /** The address of the document owner. */
  address: StringResult;
  /** THe additional address information of the document owner. */
  additionalAddressInformation: StringResult;

  additionalOptionalAddressInformation: StringResult;
  /** The place of birth of the document owner. */
  placeOfBirth: StringResult;
  /** The nationality of the document owner. */
  nationality: StringResult;

  /** The race of the document owner. */
  race: StringResult;
  /** The religion of the document owner. */
  religion: StringResult;
  /** The profession of the document owner. */
  profession: StringResult;
  /** The marital status of the document owner. */
  maritalStatus: StringResult;
  /** The residential status of the document owner. */
  residentialStatus: StringResult;
  /** The employer of the document owner. */
  employer: StringResult;
  /** The sex of the document owner. */
  sex: StringResult;

  /** The date of birth of the document owner. */
  dateOfBirth: DateResult;
  /** The date of issue of the document. */
  dateOfIssue: DateResult;
  /** The date of expiry of the document. */
  dateOfExpiry: DateResult;

  /** Determines if date of expiry is permanent. */
  dateOfExpiryPermanent: boolean;

  /** The document number. */
  documentNumber: StringResult;
  /** The personal identification number. */
  personalIdNumber: StringResult;
  /** The additional number of the document. */
  documentAdditionalNumber: StringResult;
  /** The one more additional number of the document. */
  documentOptionalAdditionalNumber: StringResult;
  /** The additional personal identification number. */
  additionalPersonalIdNumber: StringResult;
  /** The issuing authority of the document. */
  issuingAuthority: StringResult;

  /** The driver license detailed info. */
  driverLicenseDetailedInfo: DriverLicenseDetailedInfo;

  /** Sponsor for a document owner. */
  sponsor: StringResult;

  /** Blood type on a document owner. */
  bloodType: StringResult;

  /** Subtype of a document */
  documentSubtype: StringResult;

  /* Whether the result is empty */
  empty: boolean;

  /** Remarks on a document. */
  remarks: StringResult;

  /** Type of residence permit. */
  residencePermitType: StringResult;

  /** Type of visa. */
  visaType: StringResult;

  /** The manufacturing year. */
  manufacturingYear: StringResult;

  /** The vehicle type. */
  vehicleType: StringResult;

  /** The eligibility category. */
  eligibilityCategory: StringResult;

  /** The specific document validity. */
  specificDocumentValidity: StringResult;

  /** The dependents info. */
  dependentsInfo: Array<DependentInfo>;

  /**
   * The vehicle owner.
   */
  readonly vehicleOwner: StringResult;
}
