/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import { BlinkIdMultiSideRecognizer } from "./BlinkIdMultiSideRecognizer";
import { BlinkIdSingleSideRecognizer } from "./BlinkIdSingleSideRecognizer";
import { RecognizerRunner } from "./RecognizerRunner";
import { LicenseUnlockResult, ServerPermissionSubmitResult } from "./licencing";
import type { EmscriptenModule } from "./emscripten";

export interface BlinkIdWasmModule extends BlinkIdBindings, EmscriptenModule {}

export interface BlinkIdBindings {
  BlinkIdSingleSideRecognizer: typeof BlinkIdSingleSideRecognizer;
  BlinkIdMultiSideRecognizer: typeof BlinkIdMultiSideRecognizer;
  RecognizerRunner: typeof RecognizerRunner;
  initializeWithLicenseKey: (
    licenceKey: string,
    userId: string,
    allowHelloMessage: boolean,
  ) => LicenseUnlockResult;
  submitServerPermission: (
    serverPermission: unknown,
  ) => ServerPermissionSubmitResult;
  getActiveLicenseTokenInfo: () => LicenseUnlockResult;
}

// TEST

// declare const Module: BlinkIdWasmModule;

// const recognizer = new Module.BlinkIdSingleSideRecognizer();
// const x = new Module.RecognizerRunner([recognizer], true, {});

// x.reconfigureRecognizers([recognizer], true);
