/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import { EmbindObject } from "./EmbindObject";

export declare abstract class Recognizer<
  TSettings,
  TResult,
> extends EmbindObject {
  getResult: () => TResult;
  currentSettings: () => TSettings;
  updateSettings: (settings: TSettings) => void;
  toSignedJSON: () => SignedJSON;
}

export type SignedJSON = {
  payload: string;
  signature: string;
  signatureVersion: string;
};
