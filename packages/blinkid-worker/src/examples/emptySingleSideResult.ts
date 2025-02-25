/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import { BlinkIdSingleSideRecognizerResult } from "@microblink/blinkid-wasm";

export type BlinkIdMultiSideRecognizerResultSubset = Pick<
  BlinkIdSingleSideRecognizerResult,
  | "state"
  | "processingStatus"
  | "imageAnalysisResult"
  | "additionalProcessingInfo"
>;

export const emptySingleSideResult: BlinkIdSingleSideRecognizerResult = {
  state: 0,
  barcodeStepUsed: false,
  faceImageLocation: undefined,
  faceImageSide: undefined,
  additionalAddressInformation: {
    latin: "",
    arabic: "",
    cyrillic: "",
  },
  additionalNameInformation: {
    latin: "",
    arabic: "",
    cyrillic: "",
  },
  additionalOptionalAddressInformation: {
    latin: "",
    arabic: "",
    cyrillic: "",
  },
  fathersName: {
    latin: "",
    arabic: "",
    cyrillic: "",
  },
  mothersName: {
    latin: "",
    arabic: "",
    cyrillic: "",
  },
  address: {
    latin: "",
    arabic: "",
    cyrillic: "",
  },
  barcode: {
    additionalNameInformation: "",
    address: "",
    addressDetailedInfo: {
      street: "",
      postalCode: "",
      city: "",
      jurisdiction: "",
    },
    barcodeData: {
      uncertain: false,
      barcodeFormat: 0,
      stringData: "",
      rawBytes: new Uint8Array(),
    },
    dateOfBirth: {
      day: 0,
      month: 0,
      year: 0,
      originalString: "",
      successfullyParsed: false,
      empty: true,
    },
    dateOfExpiry: {
      day: 0,
      month: 0,
      year: 0,
      originalString: "",
      successfullyParsed: false,
      empty: true,
    },
    dateOfIssue: {
      day: 0,
      month: 0,
      year: 0,
      originalString: "",
      successfullyParsed: false,
      empty: true,
    },
    documentAdditionalNumber: "",
    documentNumber: "",
    driverLicenseDetailedInfo: {
      conditions: "",
      endorsements: "",
      restrictions: "",
      vehicleClass: "",
      vehicleClassesInfo: [],
    },
    employer: "",
    empty: true,
    extendedElements: [],
    firstName: "",
    fullName: "",
    issuingAuthority: "",
    lastName: "",
    maritalStatus: "",
    middleName: "",
    nationality: "",
    personalIdNumber: "",
    placeOfBirth: "",
    profession: "",
    race: "",
    religion: "",
    residentialStatus: "",
    sex: "",
  },
  classInfo: {
    country: 0,
    region: 0,
    documentType: 0,
    countryName: "",
    isoNumericCountryCode: "",
    isoAlpha2CountryCode: "",
    isoAlpha3CountryCode: "",
  },
  dateOfBirth: {
    day: 0,
    month: 0,
    year: 0,
    originalString: {
      latin: "",
      arabic: "",
      cyrillic: "",
    },
    successfullyParsed: false,
    filledByDomainKnowledge: false,
    empty: true,
  },
  dateOfExpiry: {
    day: 0,
    month: 0,
    year: 0,
    originalString: {
      latin: "",
      arabic: "",
      cyrillic: "",
    },
    successfullyParsed: false,
    filledByDomainKnowledge: false,
    empty: true,
  },
  dateOfExpiryPermanent: false,
  dateOfIssue: {
    day: 0,
    month: 0,
    year: 0,
    originalString: {
      latin: "",
      arabic: "",
      cyrillic: "",
    },
    successfullyParsed: false,
    filledByDomainKnowledge: false,
    empty: true,
  },
  documentAdditionalNumber: {
    latin: "",
    arabic: "",
    cyrillic: "",
  },
  documentOptionalAdditionalNumber: {
    latin: "",
    arabic: "",
    cyrillic: "",
  },
  documentNumber: {
    latin: "",
    arabic: "",
    cyrillic: "",
  },
  driverLicenseDetailedInfo: {
    conditions: {
      latin: "",
      arabic: "",
      cyrillic: "",
    },
    endorsements: {
      latin: "",
      arabic: "",
      cyrillic: "",
    },
    restrictions: {
      latin: "",
      arabic: "",
      cyrillic: "",
    },
    vehicleClass: {
      latin: "",
      arabic: "",
      cyrillic: "",
    },
    vehicleClassesInfo: [],
  },
  employer: {
    latin: "",
    arabic: "",
    cyrillic: "",
  },
  faceImage: {
    rawImage: null,
    encodedImage: new Uint8Array(),
  },
  firstName: {
    latin: "",
    arabic: "",
    cyrillic: "",
  },
  fullName: {
    latin: "",
    arabic: "",
    cyrillic: "",
  },
  issuingAuthority: {
    latin: "",
    arabic: "",
    cyrillic: "",
  },
  lastName: {
    latin: "",
    arabic: "",
    cyrillic: "",
  },
  localizedName: {
    latin: "",
    arabic: "",
    cyrillic: "",
  },
  maritalStatus: {
    latin: "",
    arabic: "",
    cyrillic: "",
  },
  mrz: {
    alienNumber: "",
    applicationReceiptNumber: "",
    dateOfBirth: {
      day: 0,
      month: 0,
      year: 0,
      originalString: "",
      successfullyParsed: false,
      empty: true,
    },
    dateOfExpiry: {
      day: 0,
      month: 0,
      year: 0,
      originalString: "",
      successfullyParsed: false,
      empty: true,
    },
    documentCode: "",
    documentNumber: "",
    documentType: 0,
    gender: "",
    immigrantCaseNumber: "",
    issuer: "",
    issuerName: "",
    nationality: "",
    nationalityName: "",
    opt1: "",
    opt2: "",
    parsed: false,
    primaryID: "",
    rawMRZString: "",
    sanitizedDocumentCode: "",
    sanitizedDocumentNumber: "",
    sanitizedIssuer: "",
    sanitizedNationality: "",
    sanitizedOpt1: "",
    sanitizedOpt2: "",
    secondaryID: "",
    verified: false,
  },
  nationality: {
    latin: "",
    arabic: "",
    cyrillic: "",
  },
  personalIdNumber: {
    latin: "",
    arabic: "",
    cyrillic: "",
  },
  placeOfBirth: {
    latin: "",
    arabic: "",
    cyrillic: "",
  },
  profession: {
    latin: "",
    arabic: "",
    cyrillic: "",
  },
  race: {
    latin: "",
    arabic: "",
    cyrillic: "",
  },
  religion: {
    latin: "",
    arabic: "",
    cyrillic: "",
  },
  residentialStatus: {
    latin: "",
    arabic: "",
    cyrillic: "",
  },
  sex: {
    latin: "",
    arabic: "",
    cyrillic: "",
  },
  sponsor: {
    latin: "",
    arabic: "",
    cyrillic: "",
  },
  bloodType: {
    latin: "",
    arabic: "",
    cyrillic: "",
  },
  signatureImage: {
    rawImage: null,
    encodedImage: new Uint8Array(),
  },
  recognitionMode: 0,
  documentSubtype: {
    latin: "",
    arabic: "",
    cyrillic: "",
  },
  additionalProcessingInfo: {
    imageExtractionFailures: [],
    missingMandatoryFields: [],
    invalidCharacterFields: [],
    extraPresentFields: [],
  },
  barcodeCameraFrame: {
    frame: null,
    orientation: 0,
  },
  cameraFrame: {
    frame: null,
    orientation: 0,
  },
  fullDocumentImage: {
    rawImage: null,
    encodedImage: new Uint8Array(),
  },
  processingStatus: 2,
  imageAnalysisResult: {
    blurDetected: false,
    glareDetected: false,
    cardOrientation: 0,
    documentImageColorStatus: 0,
    documentImageMoireStatus: 0,
    faceDetectionStatus: 0,
    mrzDetectionStatus: 0,
    barcodeDetectionStatus: 0,
    realIDDetectionStatus: 0,
  },
  viz: {
    vehicleOwner: {},
    dependentsInfo: [],
    eligibilityCategory: {},
    manufacturingYear: {},
    residencePermitType: {},
    specificDocumentValidity: {},
    vehicleType: {},
    visaType: {},
    remarks: {},
    // old stuff
    firstName: {
      latin: "",
      arabic: "",
      cyrillic: "",
    },
    lastName: {
      latin: "",
      arabic: "",
      cyrillic: "",
    },
    fathersName: {
      latin: "",
      arabic: "",
      cyrillic: "",
    },
    mothersName: {
      latin: "",
      arabic: "",
      cyrillic: "",
    },
    fullName: {
      latin: "",
      arabic: "",
      cyrillic: "",
    },
    additionalNameInformation: {
      latin: "",
      arabic: "",
      cyrillic: "",
    },
    additionalOptionalAddressInformation: {
      latin: "",
      arabic: "",
      cyrillic: "",
    },
    localizedName: {
      latin: "",
      arabic: "",
      cyrillic: "",
    },
    address: {
      latin: "",
      arabic: "",
      cyrillic: "",
    },
    additionalAddressInformation: {
      latin: "",
      arabic: "",
      cyrillic: "",
    },
    placeOfBirth: {
      latin: "",
      arabic: "",
      cyrillic: "",
    },
    nationality: {
      latin: "",
      arabic: "",
      cyrillic: "",
    },
    race: {
      latin: "",
      arabic: "",
      cyrillic: "",
    },
    religion: {
      latin: "",
      arabic: "",
      cyrillic: "",
    },
    profession: {
      latin: "",
      arabic: "",
      cyrillic: "",
    },
    maritalStatus: {
      latin: "",
      arabic: "",
      cyrillic: "",
    },
    residentialStatus: {
      latin: "",
      arabic: "",
      cyrillic: "",
    },
    employer: {
      latin: "",
      arabic: "",
      cyrillic: "",
    },
    sex: {
      latin: "",
      arabic: "",
      cyrillic: "",
    },
    dateOfBirth: {
      day: 0,
      month: 0,
      year: 0,
      originalString: {
        latin: "",
        arabic: "",
        cyrillic: "",
      },
      successfullyParsed: false,
      filledByDomainKnowledge: false,
      empty: true,
    },
    dateOfIssue: {
      day: 0,
      month: 0,
      year: 0,
      originalString: {
        latin: "",
        arabic: "",
        cyrillic: "",
      },
      successfullyParsed: false,
      filledByDomainKnowledge: false,
      empty: true,
    },
    dateOfExpiry: {
      day: 0,
      month: 0,
      year: 0,
      originalString: {
        latin: "",
        arabic: "",
        cyrillic: "",
      },
      successfullyParsed: false,
      filledByDomainKnowledge: false,
      empty: true,
    },
    dateOfExpiryPermanent: false,
    documentNumber: {
      latin: "",
      arabic: "",
      cyrillic: "",
    },
    personalIdNumber: {
      latin: "",
      arabic: "",
      cyrillic: "",
    },
    documentAdditionalNumber: {
      latin: "",
      arabic: "",
      cyrillic: "",
    },
    documentOptionalAdditionalNumber: {
      latin: "",
      arabic: "",
      cyrillic: "",
    },
    additionalPersonalIdNumber: {
      latin: "",
      arabic: "",
      cyrillic: "",
    },
    issuingAuthority: {
      latin: "",
      arabic: "",
      cyrillic: "",
    },
    driverLicenseDetailedInfo: {
      conditions: {
        latin: "",
        arabic: "",
        cyrillic: "",
      },
      endorsements: {
        latin: "",
        arabic: "",
        cyrillic: "",
      },
      restrictions: {
        latin: "",
        arabic: "",
        cyrillic: "",
      },
      vehicleClass: {
        latin: "",
        arabic: "",
        cyrillic: "",
      },
      vehicleClassesInfo: [],
    },
    empty: true,
    sponsor: {
      latin: "",
      arabic: "",
      cyrillic: "",
    },
    bloodType: {
      latin: "",
      arabic: "",
      cyrillic: "",
    },
    documentSubtype: {
      latin: "",
      arabic: "",
      cyrillic: "",
    },
  },
} satisfies BlinkIdSingleSideRecognizerResult;
