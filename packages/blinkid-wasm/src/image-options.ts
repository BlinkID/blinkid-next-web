/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import { ExtensionFactors } from "./ExtensionFactors";

export interface FullDocumentImageOptions {
  /**
   * If enabled, the result will contain dewarped image of the document.
   */
  returnFullDocumentImage: boolean;

  /**
   * If enabled, the result will contain JPEG-encoded image of the document.
   */
  returnEncodedFullDocumentImage: boolean;

  /**
   * The DPI (Dots Per Inch) for full document image in cases when it
   * should be returned. It applies for both encoded and non-encoded versions.
   */
  fullDocumentImageDpi: number;

  /**
   * extension factors for full document image.
   */
  fullDocumentImageExtensionFactors: ExtensionFactors;
}

export interface FaceImageOptions {
  /**
   * If enabled, the result will contain dewarped image of the face.
   */
  returnFaceImage: boolean;

  /**
   * If enabled, the result will contain JPEG-encoded image of the face.
   */
  returnEncodedFaceImage: boolean;

  /**
   * The DPI (Dots Per Inch) for face image in cases when it
   * should be returned. It applies for both encoded and non-encoded versions.
   */
  faceImageDpi: number;
}

export interface SignatureImageOptions {
  /**
   * If enabled, the result will contain dewarped image of the signature.
   */
  returnSignatureImage: boolean;

  /**
   * If enabled, the result will contain JPEG-encoded image of the signature.
   */
  returnEncodedSignatureImage: boolean;

  /**
   * The DPI (Dots Per Inch) for signature image in cases when it
   * should be returned. It applies for both encoded and non-encoded versions.
   */
  signatureImageDpi: number;
}

export interface RecognizerImageOptions
  extends FullDocumentImageOptions,
    FaceImageOptions,
    SignatureImageOptions {}
