/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import {
  BlinkIdCore,
  createBlinkIdCore,
  type BlinkIdInitSettings,
} from "@microblink/blinkid-core";
import {
  BlinkIdUxManager,
  createBlinkIdFeedbackUi,
  LocalizationStrings,
} from "@microblink/blinkid-ux-manager";
import {
  CameraManager,
  CameraManagerComponent,
  createCameraManagerUi,
} from "@microblink/camera-manager";
import { Simplify } from "type-fest";

export type BlinkIdUiSettings = Simplify<
  {
    targetNode?: HTMLElement;
    feedbackLocalization?: Partial<LocalizationStrings>;
  } & BlinkIdInitSettings
>;

export type BlinkIdUi = {
  blinkIdCore: BlinkIdCore;
  cameraManager: CameraManager;
  blinkIdUxManager: BlinkIdUxManager;
  cameraUi: CameraManagerComponent;
  /**
   * Destroys the BlinkID UI and releases all resources.
   */
  destroy: () => Promise<void>;
  addOnResultCallback: InstanceType<
    typeof BlinkIdUxManager
  >["addOnResultCallback"];
  addOnErrorCallback: InstanceType<
    typeof BlinkIdUxManager
  >["addOnErrorCallback"];
};

export const createBlinkIdUi = async ({
  licenseKey,
  targetNode,
  blinkIdSettings,
  feedbackLocalization,
}: BlinkIdUiSettings) => {
  // we first initialize the direct API. This loads the WASM module and initializes the engine
  const blinkIdCore = await createBlinkIdCore({
    licenseKey,
    blinkIdSettings,
  });

  // we create the camera manager
  const cameraManager = new CameraManager();

  // we create the UX manager
  const blinkIdUxManager = new BlinkIdUxManager(cameraManager, blinkIdCore);

  // this creates the UI and attaches it to the DOM
  const cameraUi = await createCameraManagerUi(cameraManager, targetNode);

  // this creates the feedback UI and attaches it to the camera UI
  createBlinkIdFeedbackUi(blinkIdUxManager, cameraUi, {
    localizationStrings: feedbackLocalization,
  });

  // selects the camera and starts the stream
  await cameraManager.startCameraStream();

  // starts processing
  await cameraManager.startFrameCapture();

  const destroy = async () => {
    cameraUi.dismount();
    try {
      await blinkIdCore.terminateWorker();
    } catch (error) {
      console.warn(error);
    }
  };

  const returnObject: BlinkIdUi = {
    blinkIdCore,
    cameraManager,
    blinkIdUxManager,
    cameraUi,
    destroy,
    addOnErrorCallback:
      blinkIdUxManager.addOnErrorCallback.bind(blinkIdUxManager),
    addOnResultCallback:
      blinkIdUxManager.addOnResultCallback.bind(blinkIdUxManager),
  };

  return returnObject;
};
