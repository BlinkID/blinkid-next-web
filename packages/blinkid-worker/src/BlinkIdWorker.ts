/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import { expose, finalizer } from "comlink";
import { detectWasmFeatures, WasmVariant } from "./wasm-feature-detect";

import { merge } from "merge-anything";

import {
  BlinkIdMultiSideRecognizer,
  BlinkIdMultiSideRecognizerSettings,
  BlinkIdSingleSideRecognizer,
  BlinkIdWasmModule,
  CapturedFrame,
  DetectionStatus,
  DisplayableQuad,
  LicenseTokenState,
  RecognizerRunner,
  ServerPermissionSubmitResultStatus,
} from "@microblink/blinkid-wasm";
import { BlinkIdModernConverter } from "./BlinkIdModernConverter";
import { BlinkIdResult } from "./BlinkIdResult";
import { FrameAnalysisResult } from "./FrameAnalysisResult";
import { getCrossOriginWorkerURL } from "./getCrossOriginWorkerURL";
import { isIOS } from "./isSafari";
import { obtainNewServerPermission } from "./licencing";
import { mbToWasmPages } from "./mbToWasmPages";
import { convertEmscriptenStatusToProgress } from "./utils";

// might be needed for types to work

const SCRIPT_NAME = "BlinkIDWasmSDK";

export type BlinkIdWorkerInitSettings = {
  /**
   * The parent directory where the `/resources` directory is hosted.
   * Defaults to `window.location.href`, at the root of the current page.
   */
  licenseKey: string;
  resourcesLocation?: string;
  userId: string;
  wasmVariant?: WasmVariant;
  /**
   * The initial memory allocation for the Wasm module, in megabytes.
   */
  initialMemory?: number;
  scanningMode?: ActiveRecognizer;
  blinkIdSettings?: Partial<BlinkIdMultiSideRecognizerSettings>;
  useBarcodeDeblurModel: boolean;
};

export type LoadWasmParams = {
  resourceUrl: string;
  variant?: WasmVariant;
  useBarcodeDeblurModel: boolean;
  initialMemory?: number;
};

export type ActiveRecognizer = "singleSide" | "multiSide";

class BlinkIdWorker {
  // core objects
  #wasmModule?: BlinkIdWasmModule;
  #runner?: RecognizerRunner;
  #blinkIdSingleSideRecognizer?: BlinkIdSingleSideRecognizer;
  #blinkIdMultiSideRecognizer?: BlinkIdMultiSideRecognizer;
  #blinkIdModernConverter = new BlinkIdModernConverter();

  // state
  #lastDetectionStatus: DetectionStatus = DetectionStatus.Failed;
  #lastQuad?: DisplayableQuad;
  #capturedDocument = false;

  // public properties
  activeRecognizer: ActiveRecognizer = "multiSide";
  progressStatusCallback?: (param: number) => void;

  // Comlink has issues with proxies inside objects...
  setProgressStatusCallback(callback: (param: number) => void) {
    this.progressStatusCallback = callback;
  }

  /**
   * This method loads the Wasm module.
   */

  async #loadWasm({
    resourceUrl,
    variant,
    useBarcodeDeblurModel,
    initialMemory,
  }: LoadWasmParams) {
    if (this.#wasmModule) {
      console.log("Wasm already loaded");
      return;
    }

    const wasmVariant = variant ?? (await detectWasmFeatures());

    const modelWeight = useBarcodeDeblurModel ? "full" : "lightweight";

    const variantUrl = `${resourceUrl}/${modelWeight}/${wasmVariant}`;
    const loaderUrl = `${variantUrl}/${SCRIPT_NAME}.js`;

    const crossOriginLoaderUrl = await getCrossOriginWorkerURL(loaderUrl);

    try {
      importScripts(crossOriginLoaderUrl);
    } catch (error) {
      console.error("loading scripts failed", error);
      throw error;
    }

    if (!self.BlinkIDWasmSDK) {
      throw new Error("MicroblinkWasmSDK not found in global scope");
    }

    // use default memory settings if not provided
    if (!initialMemory) {
      // safari requires a larger initial memory allocation as it often block memory growth
      initialMemory = isIOS() ? 700 : 200;
    }

    const wasmMemory = new WebAssembly.Memory({
      initial: mbToWasmPages(initialMemory),
      maximum: mbToWasmPages(2048),
      shared: wasmVariant === "advanced-threads",
    });

    /**
     * https://emscripten.org/docs/api_reference/module.html#module-object
     */
    this.#wasmModule = await self.BlinkIDWasmSDK({
      locateFile: (path) => {
        const filePath = variantUrl + "/" + path;
        return filePath;
      },
      // pthreads build breaks without this:
      // "Failed to execute 'createObjectURL' on 'URL': Overload resolution failed."
      mainScriptUrlOrBlob: loaderUrl,
      wasmMemory,
      noExitRuntime: true,
      setStatus: (text) => {
        const progressPercent = convertEmscriptenStatusToProgress(text);
        if (this.progressStatusCallback) {
          this.progressStatusCallback(progressPercent);
        }
      },
    });

    if (!this.#wasmModule) {
      throw new Error("Failed to load Wasm module");
    }
  }

  #getActiveRecognizer() {
    if (this.activeRecognizer === "singleSide") {
      return this.#blinkIdSingleSideRecognizer;
    }

    return this.#blinkIdMultiSideRecognizer;
  }

  /**
   * This method initializes everything.
   */
  async initBlinkId(settings: BlinkIdWorkerInitSettings) {
    const resourcesPath = new URL(
      "resources/",
      settings.resourcesLocation,
    ).toString();
    // initialize wasm module, will reuse if already loaded
    await this.#loadWasm({
      resourceUrl: resourcesPath,
      variant: settings.wasmVariant,
      initialMemory: settings.initialMemory,
      useBarcodeDeblurModel: settings.useBarcodeDeblurModel,
    });

    if (!this.#wasmModule) {
      throw new Error("Wasm module not loaded");
    }

    // initialize with license key
    const licenceUnlockResult = this.#wasmModule.initializeWithLicenseKey(
      settings.licenseKey,
      settings.userId,
      false,
    );

    // check if we need to obtain a server permission
    if (
      licenceUnlockResult.unlockResult ===
      LicenseTokenState.RequiresServerPermission
    ) {
      const serverPermissionResponse =
        await obtainNewServerPermission(licenceUnlockResult);

      const serverPermissionResult = this.#wasmModule.submitServerPermission(
        JSON.stringify(serverPermissionResponse),
      );

      if (
        serverPermissionResult.status !== ServerPermissionSubmitResultStatus.Ok
      ) {
        // TODO: more robust error messages
        throw new Error("Server unlock not ok.");
      }
    }

    // init both recognizers
    this.#blinkIdSingleSideRecognizer =
      new this.#wasmModule.BlinkIdSingleSideRecognizer();

    this.#blinkIdMultiSideRecognizer =
      new this.#wasmModule.BlinkIdMultiSideRecognizer();

    // add barcode callback
    // TODO: simplify this
    if (!settings.blinkIdSettings) {
      settings.blinkIdSettings = {};
    }

    settings.blinkIdSettings.barcodeScanningStartedCallback = () => {
      console.log("Barcode scanning started");
      this.#blinkIdModernConverter.barcodeScanningInProgress = true;
    };

    // update settings
    void this.updateSettings(settings.blinkIdSettings);

    // set active recognizer if provided
    if (settings.scanningMode) {
      this.activeRecognizer = settings.scanningMode;
    }

    const activeRecognizer = this.#getActiveRecognizer();

    if (!activeRecognizer) {
      throw new Error("Active recognizer not initialized");
    }

    // init runner
    this.#runner = new this.#wasmModule.RecognizerRunner(
      [activeRecognizer],
      false,
      {
        // This will trigger even if no quads are detected
        onQuadDetection: (quad) => {
          // TODO: also execute user-provided quad detections?
          this.#lastDetectionStatus = quad.detectionStatus;
          this.#lastQuad = quad;
        },
      },
    );

    // DEBUG FLAG FOR DETECTION ONLY MODE
    // this.#runner.setDetectionOnlyMode(true);
  }

  selectScanningMode(mode: ActiveRecognizer) {
    this.activeRecognizer = mode;
  }

  updateSettings(
    incomingPartialSettings: Partial<BlinkIdMultiSideRecognizerSettings>,
  ) {
    if (
      !this.#blinkIdMultiSideRecognizer ||
      !this.#blinkIdSingleSideRecognizer
    ) {
      throw new Error("Recognizers not initialized");
    }

    const activeRecognizer = this.#getActiveRecognizer();

    if (!activeRecognizer) {
      throw new Error("Active recognizer not initialized");
    }

    this.#resetInternalState();

    // assume multiside settings are the same as single side + some extras
    const originalBlinkIDSettings =
      this.#blinkIdMultiSideRecognizer.currentSettings();

    // merge defaults with user settings
    const newSettings = merge(
      originalBlinkIDSettings,
      incomingPartialSettings as BlinkIdMultiSideRecognizerSettings,
    );

    // First initialization, no need for reconfiguring, as no recognizers aren't
    // assigned to the runner
    if (!this.#runner) {
      this.#blinkIdSingleSideRecognizer.updateSettings(newSettings);
      this.#blinkIdMultiSideRecognizer.updateSettings(newSettings);
      // We need to empty the recognizers array before reconfiguring
    } else {
      this.#runner.reconfigureRecognizers([], false);
      this.#blinkIdSingleSideRecognizer.updateSettings(newSettings);
      this.#blinkIdMultiSideRecognizer.updateSettings(newSettings);
      this.#runner.reconfigureRecognizers([activeRecognizer], false);
    }
  }

  /**
   * This method processes the image.
   */
  processImage(image: CapturedFrame): FrameAnalysisResult {
    const activeRecognizer = this.#getActiveRecognizer();

    if (!this.#runner) {
      throw new Error("Recognizer runner not initialized");
    }

    if (!activeRecognizer) {
      throw new Error("Active recognizer not initialized");
    }

    // TODO: TEST!!!
    this.#lastDetectionStatus = DetectionStatus.Failed;
    this.#lastQuad = undefined;

    // process image, this will trigger callbacks
    this.#runner.processImage(image);

    // runner callbacks will trigger at this point
    const recognizerResult = activeRecognizer.getResult();

    const frameAnalysisResult =
      this.#blinkIdModernConverter.convertToFrameResult(
        recognizerResult,
        this.#lastDetectionStatus,
        this.#lastQuad,
      );

    return frameAnalysisResult;
  }

  /**
   * This method returns the result.
   */
  getResult(): BlinkIdResult {
    const activeRecognizer = this.#getActiveRecognizer();

    if (!activeRecognizer) {
      throw new Error("Active recognizer not initialized");
    }

    const result = activeRecognizer.getResult();

    return result;
  }

  #resetInternalState() {
    this.#lastDetectionStatus = DetectionStatus.Failed;
    this.#capturedDocument = false;
    this.#blinkIdModernConverter.reset();
  }

  resetScanningSession() {
    if (!this.#runner) {
      throw new Error("Not initialized. Call initBlinkId first.");
    }

    this.#resetInternalState();
    this.#runner.resetRecognizers(true);
  }

  /**
   * This method is called when the worker is terminated.
   */
  [finalizer]() {
    // console.log("Comlink.finalizer called on proxyWorker");
    // Can't use this as the `proxyWorker` gets randomly GC'd, even if in use
    // self.close();
  }

  /**
   * Terminates the workers and the Wasm runtime.
   */
  terminate() {
    self.close();
  }

  ping() {
    return 1;
  }
}

const blinkIdWorker = new BlinkIdWorker();

expose(blinkIdWorker);

export type BlinkIdWorkerProxy = Omit<BlinkIdWorker, typeof finalizer>;
