/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import { ClassInfo } from "./ClassInfo";
import { ImageAnalysisResult } from "./ImageAnalysisResult";
import { ProcessingStatus } from "./ProcessingStatus";
import { DriverLicenseDetailedInfo } from "./DriverLicenseDetailedInfo";
import { RecognitionMode } from "./RecognitionMode";
import { CameraFrameResult } from "./CameraFrameResult";
import { ImageResult } from "./ImageResult";
import { Rectangle } from "./Rectangle";
import { DocumentSide } from "./DocumentSide";
import { StringResult } from "./StringResult";
import { DateResult } from "./DateResult";
import { RecognizerResultState } from "./RecognizerResultState";
import { DataMatchResult } from "./data-match";
import { AdditionalProcessingInfo } from "./AdditionalProcessingInfo";
import { VIZResult } from "./VIZResult";
import { BarcodeResult } from "./barcode";
import { MrzResult } from "./mrz";

/**
 * The base result of image recognition when using either the BlinkIdSingleSideRecognizer or BlinkIdMultiSideRecognizer.
 */
export interface BaseBlinkIdRecognizerResult {
  /**
   * The additional address information of the document owner.
   */
  additionalAddressInformation: StringResult;

  /**
   * The additional name information of the document owner.
   */
  additionalNameInformation: StringResult;

  /**
   * The one more additional address information of the document owner.
   */
  additionalOptionalAddressInformation: StringResult;

  /**
   * The address of the document owner.
   */
  address: StringResult;

  /**
   * The data extracted from the barcode.
   */
  barcode: BarcodeResult;

  /**
   * This member indicates whether the barcode scanning step was utilized during the
   * process.
   * If the barcode scanning step was executed: a parsable barcode image will be stored in the
   * `barcodeCameraFrame`.
   * If the barcode scanning step was not executed: a parsable barcode image will be stored in the
   * `fullDocumentFrontImage` or `fullDocumentBackImage` depending on which side the barcode was on.
   * */
  barcodeStepUsed: boolean;

  /**
   * Full video feed frame from which barcode data was extracted.
   */
  barcodeCameraFrame: CameraFrameResult;

  /**
   * The blood type on a document owner.
   */
  bloodType: StringResult;

  /**
   * The class info.
   */
  classInfo: ClassInfo;

  /** Subtype of a document */
  documentSubtype: StringResult;

  /**
   * The date of birth of the document owner.
   */
  dateOfBirth: DateResult;

  /**
   * The date of expiry of the document.
   */
  dateOfExpiry: DateResult;

  /**
   * Determines if date of expiry is permanent.
   */
  dateOfExpiryPermanent: boolean;

  /**
   * The date of issue of the document.
   */
  dateOfIssue: DateResult;

  /**
   * The additional number of the document.
   */
  documentAdditionalNumber: StringResult;

  /**
   * The one more additional number of the document.
   */
  documentOptionalAdditionalNumber: StringResult;

  /**
   * The document number.
   */
  documentNumber: StringResult;

  /**
   * The driver license detailed info.
   */
  driverLicenseDetailedInfo: DriverLicenseDetailedInfo;

  /**
   * The employer of the document owner.
   */
  employer: StringResult;

  /**
   * The face image.
   */
  faceImage: ImageResult;

  /**
   * The location of the face image on the document.
   */
  faceImageLocation?: Rectangle;

  /**
   * The side of the document in which the face image is located.
   */
  faceImageSide?: DocumentSide;

  /**
   * The fathers name of the document owner.
   */
  fathersName: StringResult;

  /**
   * The first name of the document owner.
   */
  firstName: StringResult;

  /**
   * The full name of the document owner.
   */
  fullName: StringResult;

  /**
   * The issuing authority of the document.
   */
  issuingAuthority: StringResult;

  /**
   * The last name of the document owner.
   */
  lastName: StringResult;

  /**
   * The localized name of the document owner.
   */
  localizedName: StringResult;

  /**
   * The marital status of the document owner.
   */
  maritalStatus: StringResult;

  /**
   * The data extracted from the machine readable zone.
   */
  mrz: MrzResult;

  /**
   * The mothers name of the document owner.
   */
  mothersName: StringResult;

  /**
   * The nationality of the document owner.
   */
  nationality: StringResult;

  /**
   * The personal identification number.
   */
  personalIdNumber: StringResult;

  /**
   * The place of birth of the document owner.
   */
  placeOfBirth: StringResult;

  /**
   * Status of the last recognition process.
   */
  processingStatus: ProcessingStatus;

  /**
   * The profession of the document owner.
   */
  profession: StringResult;

  /**
   * The race of the document owner.
   */
  race: StringResult;

  /**
   * Recognition mode used to scan current document.
   */
  recognitionMode: RecognitionMode;

  /**
   * The religion of the document owner.
   */
  religion: StringResult;

  /**
   * The residential status of the document owner.
   */
  residentialStatus: StringResult;

  /**
   * The sex of the document owner.
   */
  sex: StringResult;

  /**
   * The image of the signature.
   */
  signatureImage: ImageResult;

  /**
   * Sponsor of a document owner.
   */
  sponsor: StringResult;

  state: RecognizerResultState;
}

/**
 * The result of image recognition when using the BlinkIdSingleSideRecognizer.
 */

export interface BlinkIdSingleSideRecognizerResult
  extends BaseBlinkIdRecognizerResult {
  /**
   * Detailed information about missing, invalid and extra fields.
   */
  additionalProcessingInfo: AdditionalProcessingInfo;

  /**
   * Full video feed frame from which document data was extracted.
   */
  cameraFrame: CameraFrameResult;

  /**
   * Cropped and dewarped image of a document that has been scanned.
   */
  fullDocumentImage: ImageResult;

  /**
   * Result of document image analysis.
   */
  imageAnalysisResult: ImageAnalysisResult;

  /**
   * The data extracted from the visual inspection zone.
   */
  viz: VIZResult;
}

export interface BlinkIdMultiSideRecognizerResult
  extends BaseBlinkIdRecognizerResult {
  /**
   * Detailed information about missing, invalid and extra fields.
   */
  backAdditionalProcessingInfo: AdditionalProcessingInfo;

  /**
   * Detailed information about missing, invalid and extra fields.
   */
  frontAdditionalProcessingInfo: AdditionalProcessingInfo;

  /**
   * Full video feed frame from which document data on front side was extracted.
   */
  frontCameraFrame: CameraFrameResult;

  /**
   * Full video feed frame from which document data on back side was extracted.
   */
  backCameraFrame: CameraFrameResult;

  /**
   * Cropped and dewarped back side image of a document that has been scanned.
   */
  fullDocumentBackImage: ImageResult;

  /**
   * Cropped and dewarped front side image of a document that has been scanned.
   */
  fullDocumentFrontImage: ImageResult;

  /**
   * Result of analysis of the image of the front side of the document.
   */
  frontImageAnalysisResult: ImageAnalysisResult;

  /**
   * Result of analysis of the image of the back side of the document.
   */
  backImageAnalysisResult: ImageAnalysisResult;

  /**
   * The data extracted from the front side visual inspection zone.
   */
  frontViz: VIZResult;

  /**
   * The data extracted from the back side visual inspection zone.
   */
  backViz: VIZResult;

  /**
   * Status of the last recognition process for the front side of the document.
   */
  frontProcessingStatus: ProcessingStatus;

  /**
   * Status of the last recognition process for the back side of the document.
   */
  backProcessingStatus: ProcessingStatus;

  /**
   * The result of the data matching algorithm for scanned parts/sides of the document.
   *
   * For example if date of expiry is scanned from the front and back side of the document and
   * values do not match, this method will return {@link DataMatchResult#Failed} for that specific
   * field, and for data match on the whole document.
   *
   * Result for the whole document will be {@link DataMatchResult#Success} only if scanned values
   * for all fields that are compared are the same. If data matching has not been performed,
   * result will be {@link DataMatchResult#NotPerformed}.
   */
  dataMatchResult: DataMatchResult;

  /**
   * {@code true} if recognizer has finished scanning first side and is now scanning back side,
   * {@code false} if it's still scanning first side.
   */
  scanningFirstSideDone: boolean;
}
