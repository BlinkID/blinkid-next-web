/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import {
  ProcessingStatus,
  type BlinkIdCore,
  type BlinkIdResult,
  type FrameAnalysisResult,
} from "@microblink/blinkid-core";
import type { CameraManager } from "@microblink/camera-manager";
import { FeedbackStabilizer } from "@microblink/feedback-stabilizer";
import { BlinkIdProcessingError } from "./BlinkIdProcessingError";
import {
  BlinkIdUiState,
  BlinkIdUiStateKey,
  blinkIdUiStateMap,
  getUiStateKeyFromFrameResult,
} from "./blinkid-ui-state";
import { sleep } from "./utils";

/**
 * Manages the UX of the BlinkID SDK.
 */
export class BlinkIdUxManager {
  declare cameraManager: CameraManager;
  declare blinkIdCore: BlinkIdCore;
  declare uiState: BlinkIdUiState;
  // unused
  declare errorState?: BlinkIdProcessingError;
  declare rawUiStateKey: BlinkIdUiStateKey;
  declare feedbackStabilizer: FeedbackStabilizer<typeof blinkIdUiStateMap>;

  #threadBusy = false;
  #timeoutId?: number;
  /** Timeout duration in ms */
  #timeoutDuration = 10000; // 10s

  clearScanTimeout = () => {
    console.debug("⏳🔴 clearing timeout");
    window.clearTimeout(this.#timeoutId);
  };

  #onUiStateChangedCallbacks = new Set<(uiState: BlinkIdUiState) => void>();
  #onResultCallbacks = new Set<(result: BlinkIdResult) => void>();
  #onFrameProcessCallbacks = new Set<
    (frameResult: FrameAnalysisResult) => void
  >();
  #onErrorCallbacks = new Set<(errorState: BlinkIdProcessingError) => void>();
  #onUserCancelCallbacks = new Set<(reason: unknown) => void>();

  /**
   * Adds a callback function to be executed when the UI state changes.
   * @param callback - Function to be called when UI state changes. Receives the new UI state as parameter.
   * @returns A cleanup function that removes the callback when called.
   * @example
   * const cleanup = manager.addOnUiStateChangedCallback((newState) => {
   *   console.log('UI state changed to:', newState);
   * });
   *
   * cleanup();
   */
  addOnUiStateChangedCallback(callback: (uiState: BlinkIdUiState) => void) {
    this.#onUiStateChangedCallbacks.add(callback);
    return () => {
      this.#onUiStateChangedCallbacks.delete(callback);
    };
  }

  /**
   * Registers a callback function to be called when a scan result is available.
   * @param callback - A function that will be called with the scan result.
   * @returns A cleanup function that, when called, will remove the registered callback.
   *
   * @example
   *
   * const cleanup = manager.addOnResultCallback((result) => {
   *   console.log('Scan result:', result);
   * });
   *
   * // Later, to remove the callback:
   * cleanup();
   */
  addOnResultCallback(callback: (result: BlinkIdResult) => void) {
    this.#onResultCallbacks.add(callback);
    return () => {
      this.#onResultCallbacks.delete(callback);
    };
  }

  /**
   * Registers a callback function to be called when a frame is processed.
   * @param callback - A function that will be called with the frame analysis result.
   * @returns A cleanup function that, when called, will remove the registered callback.
   *
   * @example
   * const cleanup = manager.addOnFrameProcessCallback((frameResult) => {
   *   console.log('Frame processed:', frameResult);
   * });
   *
   * // Later, to remove the callback:
   * cleanup();
   */
  addOnFrameProcessCallback(
    callback: (frameResult: FrameAnalysisResult) => void,
  ) {
    this.#onFrameProcessCallbacks.add(callback);
    return () => {
      this.#onFrameProcessCallbacks.delete(callback);
    };
  }

  /**
   * Registers a callback function to be called when an error occurs during processing.
   * @param callback - A function that will be called with the error state.
   * @returns A cleanup function that, when called, will remove the registered callback.
   *
   * @example
   * const cleanup = manager.addOnErrorCallback((error) => {
   *   console.error('Processing error:', error);
   * });
   *
   * // Later, to remove the callback:
   * cleanup();
   */
  addOnErrorCallback(callback: (errorState: BlinkIdProcessingError) => void) {
    this.#onErrorCallbacks.add(callback);
    return () => {
      this.#onErrorCallbacks.delete(callback);
    };
  }

  /**
   * Registers a callback function to be called when the user cancels the scanning process.
   * @param callback - A function that will be called with the cancellation reason.
   * @returns A cleanup function that, when called, will remove the registered callback.
   *
   * @example
   * const cleanup = manager.addOnUserCancelCallback((reason) => {
   *   console.log('User cancelled scan:', reason);
   * });
   *
   * // Later, to remove the callback:
   * cleanup();
   */
  addOnUserCancelCallback(callback: (reason: unknown) => void) {
    this.#onUserCancelCallbacks.add(callback);
    return () => {
      this.#onUserCancelCallbacks.delete(callback);
    };
  }

  constructor(cameraManager: CameraManager, blinkIdCore: BlinkIdCore) {
    this.cameraManager = cameraManager;
    this.blinkIdCore = blinkIdCore;
    this.feedbackStabilizer = new FeedbackStabilizer(
      blinkIdUiStateMap,
      "SENSING_FRONT",
    );
    // this.feedbackStabilizer.setTimeWindow(2000); // make it snappier
    this.uiState = this.feedbackStabilizer.currentState;

    // clear timeout when we stop processing and add one when we start
    const unsubtimeout = this.cameraManager.subscribe(
      (s) => s.playbackState,
      (playbackState) => {
        console.debug(`⏯️ ${playbackState}`);
        if (playbackState !== "capturing") {
          this.clearScanTimeout();
        } else {
          // Trigger for initial scan and pause/resume
          console.debug("🔁 continuing timeout");
          this.#setTimeout(this.uiState);
        }
      },
    );

    // hacky way to usubscribe  on cleanup
    const unsubDestroy = cameraManager.subscribe(
      (s) => s.videoElement,
      (videoElement) => {
        if (!videoElement) {
          console.debug("Removing timeout subscriptions");
          unsubDestroy();
          unsubtimeout();
        }
      },
    );

    // will only trigger if the camera manager is processing frames
    cameraManager.addFrameCaptureCallback(async (imageData) => {
      if (this.#threadBusy) {
        return;
      }

      this.#threadBusy = true;
      const frameAnalysisResult = await blinkIdCore.processImage(imageData);
      this.#threadBusy = false;

      for (const callback of this.#onFrameProcessCallbacks) {
        callback(frameAnalysisResult);
      }

      // running stability test
      if (
        frameAnalysisResult.processingStatus ===
        ProcessingStatus.StabilityTestFailed
      ) {
        return;
      }

      // Handle (some) error states

      // Handle unsupported documents
      const s = frameAnalysisResult.processingStatus;

      const isUnsupportedDocument =
        s === ProcessingStatus.UnsupportedByLicense ||
        s === ProcessingStatus.UnsupportedClass ||
        s === ProcessingStatus.ClassFiltered;

      if (isUnsupportedDocument) {
        this.cameraManager.stopFrameCapture();
        this.feedbackStabilizer.reset();
        this.uiState = this.feedbackStabilizer.currentState;

        for (const callback of this.#onErrorCallbacks) {
          callback("unsupported-document");
        }

        return;
      }

      // Handle UI state changes

      const nextUiStateKey = getUiStateKeyFromFrameResult(frameAnalysisResult);

      this.rawUiStateKey = nextUiStateKey;

      const newUiState = this.feedbackStabilizer.getNewUiState(nextUiStateKey);

      // Skip if the state is the same
      if (newUiState.key === this.uiState.key) {
        return;
      }

      this.uiState = newUiState;

      for (const callback of this.#onUiStateChangedCallbacks) {
        callback(newUiState);
      }

      void this.handleUiStateChange(newUiState);
    });
  }

  /**
   * Set the duration of the timeout in milliseconds.
   */
  setTimeoutDuration(duration: number) {
    this.#timeoutDuration = duration;
  }

  #setTimeout = (uiState: BlinkIdUiState) => {
    console.debug(`⏳🟢 starting timeout for ${uiState.key}`);

    this.#timeoutId = window.setTimeout(() => {
      this.cameraManager.stopFrameCapture();

      for (const callback of this.#onErrorCallbacks) {
        callback("timeout");
      }

      // Reset the feedback stabilizer to clear the state
      // We handle this as a new scan attempt

      this.feedbackStabilizer.reset();
      this.uiState = this.feedbackStabilizer.currentState;
    }, this.#timeoutDuration);
  };

  // Side-effects are handled here
  async handleUiStateChange(uiState: BlinkIdUiState) {
    console.debug("state changed", uiState.key);
    // handle timeout for these states
    if (
      // low quality
      uiState.key === "LOW_QUALITY_FRONT" ||
      uiState.key === "LOW_QUALITY_BACK" ||
      // regular
      uiState.key === "SENSING_FRONT" ||
      uiState.key === "SENSING_BACK"
    ) {
      // Don't start a new timeout if one is already running
      if (!this.#timeoutId) {
        this.#setTimeout(uiState);
      }

      return;
    }

    // clear the timeout if it's another state
    this.clearScanTimeout();

    // Manually handle SIDE_CAPTURED
    if (uiState.key === "SIDE_CAPTURED") {
      this.cameraManager.stopFrameCapture();
      await sleep(uiState.minDuration);
      await this.cameraManager.startFrameCapture();
      return;
    }

    // Manually handle DOCUMENT_CAPTURED
    if (uiState.key === "DOCUMENT_CAPTURED") {
      this.cameraManager.stopFrameCapture();
      await sleep(uiState.minDuration); // allow animation to play out

      const result = await this.blinkIdCore.getResult();
      for (const callback of this.#onResultCallbacks) {
        callback(result);
      }
    }
  }
}
