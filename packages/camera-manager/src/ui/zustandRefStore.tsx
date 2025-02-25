/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import { createWithSignal } from "solid-zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { createStore } from "zustand/vanilla";

export type CameraUiRefs = {
  feedbackLayer: HTMLDivElement;
  overlayLayer: HTMLDivElement;
};

// this is separate because we need to be able to subscribe
// outside of the component tree
const initialState: CameraUiRefs = {
  feedbackLayer: null!,
  overlayLayer: null!,
};

export const cameraUiRefStore = createStore<CameraUiRefs>()(
  // this is important! Otherwise solid-zustand will start mutating the initial state
  subscribeWithSelector(() => structuredClone(initialState)),
);

export const cameraUiRefSignalStore = createWithSignal(cameraUiRefStore);
