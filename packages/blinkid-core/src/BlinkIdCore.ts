/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import type {
  BlinkIdMultiSideRecognizerSettings,
  CapturedFrame,
} from "@microblink/blinkid-wasm";
import type {
  ActiveRecognizer,
  BlinkIdResult,
  BlinkIdWorkerInitSettings,
  BlinkIdWorkerProxy,
  FrameAnalysisResult,
} from "@microblink/blinkid-worker";
import { Remote, transfer } from "comlink";
import type { SetOptional } from "type-fest";
import { createCustomImageData } from "./createCustomImageData";
import { createProxyWorker } from "./createProxyWorker";
import { getUserId } from "./getUserId";

/**
 * The `BlinkIdCore` is a wrapper around the `blinkid-worker` module.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BlinkIdCore extends _BlinkIdCore {}

// User ID is optional outside the worker scope
export type BlinkIdInitSettings = SetOptional<
  BlinkIdWorkerInitSettings,
  "userId"
>;

/**
 * The `_BlinkIdCore` class is private to prevent manual instantiation.
 * @private
 */
class _BlinkIdCore {
  #remoteWorker: Remote<BlinkIdWorkerProxy>;
  // TODO: Photo vs video

  constructor(remoteWorker: Remote<BlinkIdWorkerProxy>) {
    this.#remoteWorker = remoteWorker;
  }

  /**
   * Analyzes a single frame.
   *
   * @remarks
   * This method is a proxy to the `blinkid-worker` module.
   * It is a workaround to avoid memory leaks when using the `Remote` object
   * directly.
   *
   * @param image - The image to analyze.
   * @returns The analysis result or an error.
   */
  processImage = async (image: ImageData): Promise<FrameAnalysisResult> => {
    const customImageData = createCustomImageData(image);

    const capturedFrame: CapturedFrame = {
      imageData: customImageData,
      orientation: 0,
      // TODO: expose for image upload
      videoFrame: true,
    };

    const frameResult = await this.#remoteWorker.processImage(
      transfer(capturedFrame, [customImageData.data.buffer]),
    );

    return frameResult;
  };

  /**
   * Returns the BlinkID result.
   * @returns The BlinkID result.
   */
  getResult = async (): Promise<BlinkIdResult> => {
    const result = await this.#remoteWorker.getResult();
    return result;
  };

  /**
   * Updates BlinkID settings. The new settings are merged with the current
   * settings.
   *
   * @param newSettings - The new BlinkID settings. Can be a partial object.
   */
  updateSettings = async (
    newSettings: Partial<BlinkIdMultiSideRecognizerSettings>,
  ) => {
    await this.#remoteWorker.updateSettings(newSettings);
  };

  selectScanningMode = async (scanningMode: ActiveRecognizer) => {
    await this.#remoteWorker.selectScanningMode(scanningMode);
  };

  resetScanningSession = async () => {
    await this.#remoteWorker.resetScanningSession();
  };

  /**
   * Terminates the workers and the Wasm runtime.
   */
  async terminateWorker() {
    await this.#remoteWorker.terminate();
  }
}

/**
 * Creates a new `BlinkIdCore` instance.
 * @param settings - The settings for the `BlinkIdCore` instance.
 * @returns A new `BlinkIdCore` instance.
 */
export async function createBlinkIdCore(
  settings: BlinkIdInitSettings,
): Promise<BlinkIdCore> {
  const remoteWorker = await createProxyWorker();

  if (!settings.userId) {
    settings.userId = getUserId();
  }

  if (!settings.resourcesLocation) {
    settings.resourcesLocation = window.location.href;
  }

  try {
    // we added the `userid` to the settings if not provided, so this assertion is safe
    await remoteWorker.initBlinkId(settings as BlinkIdWorkerInitSettings);

    const blinkIdCore = new _BlinkIdCore(remoteWorker);

    return blinkIdCore;
  } catch (error) {
    throw new Error("Failed to initialize BlinkID", {
      cause: error,
    });
  }
}
