/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

/** List of possible types of fields that are extracted from identity documents. */

export enum FieldType {
  AdditionalAddressInformation,
  AdditionalNameInformation,
  AdditionalOptionalAddressInformation,
  AdditionalPersonalIdNumber,
  Address,
  ClassEffectiveDate,
  ClassExpiryDate,
  Conditions,
  DateOfBirth,
  DateOfExpiry,
  DateOfIssue,
  DocumentAdditionalNumber,
  DocumentOptionalAdditionalNumber,
  DocumentNumber,
  Employer,
  Endorsements,
  FathersName,
  FirstName,
  FullName,
  IssuingAuthority,
  LastName,
  LicenceType,
  LocalizedName,
  MaritalStatus,
  MothersName,
  Mrz,
  Nationality,
  PersonalIdNumber,
  PlaceOfBirth,
  Profession,
  Race,
  Religion,
  ResidentialStatus,
  Restrictions,
  Sex,
  VehicleClass,
  BloodType,
  Sponsor,
  VisaType,
  DocumentSubtype,
  Remarks,
  ResidencePermitType,
  ManufacturingYear,
  VehicleType,
  DependentDateOfBirth,
  DependentSex,
  DependentDocumentNumber,
  DependentFullName,
  EligibilityCategory,
  SpecificDocumentValidity,
  VehicleOwner,

  /** Number of possible field types. */
  Count,
}
