/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import { CameraManagerComponent } from "@microblink/camera-manager";
import { createRoot } from "solid-js";
import { createStore } from "solid-js/store";
import { BlinkIdUxManager } from "../core/BlinkIdUxManager";
import { BlinkIdProcessingError } from "../core/BlinkIdProcessingError";

export type BlinkIdUiStore = {
  blinkIdUxManager: BlinkIdUxManager;
  cameraManagerComponent: CameraManagerComponent;
  errorState?: BlinkIdProcessingError;
  // localizationStrings?: Partial<LocalizationStrings>;
  /** We're using `createRoot` for this store, and have to dispose it manually */
  disposeBlinkIdUiStore: () => void;
};

const initialState: BlinkIdUiStore = {
  blinkIdUxManager: null!,
  cameraManagerComponent: null!,
  disposeBlinkIdUiStore: null!,
  errorState: undefined,
};

export const blinkIdUiStore = createRoot((disposeBlinkIdUiStore) => {
  const [store, updateStore] = createStore<BlinkIdUiStore>(
    {} as BlinkIdUiStore,
  );
  updateStore({
    ...initialState,
    disposeBlinkIdUiStore: () => {
      disposeBlinkIdUiStore();
      updateStore({ ...initialState, disposeBlinkIdUiStore });
    },
  });

  return { store, updateStore };
});
