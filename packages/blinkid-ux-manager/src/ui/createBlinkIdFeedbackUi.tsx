/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import { render } from "solid-js/web";
import { BlinkIdUxManager } from "../core/BlinkIdUxManager";

import { CameraManagerComponent } from "@microblink/camera-manager";
import { BlinkIdFeedbackUi } from "./BlinkIdFeedbackUi";
import { LocalizationStrings } from "./LocalizationContext";
import { blinkIdUiStore } from "./blinkIdUiStore";

export type FeedbackUiOptions = {
  localizationStrings?: Partial<LocalizationStrings>;
  /**
   * If set to `true`, the BlinkID instance will not be terminated when the
   * feedback UI is unmounted.
   *
   * @defaultValue false
   */
  preserveSdkInstance?: boolean;
};

export function createBlinkIdFeedbackUi(
  blinkIdUxManager: BlinkIdUxManager,
  cameraManagerComponent: CameraManagerComponent,
  options?: FeedbackUiOptions,
) {
  const { store, updateStore } = blinkIdUiStore;
  updateStore({
    blinkIdUxManager,
    cameraManagerComponent,
  });

  const dismountUiFeedbackOverlay = render(
    () => <BlinkIdFeedbackUi localization={options?.localizationStrings} />,
    cameraManagerComponent.feedbackLayerNode,
  );

  const cleanupFeedbackUi = async () => {
    if (!options?.preserveSdkInstance) {
      await store.blinkIdUxManager.blinkIdCore.terminateWorker();
    }

    dismountUiFeedbackOverlay();
    store.disposeBlinkIdUiStore();
  };

  cameraManagerComponent.addOnDismountCallback(() => {
    // precaution to allow @ark-ui to stop machines
    setTimeout(() => {
      void cleanupFeedbackUi();
    }, 0);
  });

  return dismountUiFeedbackOverlay;
}
