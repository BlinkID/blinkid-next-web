/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import { cameraManagerStore } from "@microblink/camera-manager";
import type { Component } from "solid-js";
import { createEffect, createSignal, onCleanup, Show } from "solid-js";
import { createWithSignal } from "solid-zustand";
import { BlinkIdUiState, blinkIdUiStateMap } from "../core/blinkid-ui-state";
import {
  LocalizationProvider,
  LocalizationStrings,
} from "./LocalizationContext";
import { UiFeedbackOverlay } from "./UiFeedbackOverlay";

// this triggers extraction of CSS from the UnoCSS plugin
import "uno.css";
import { blinkIdUiStore } from "./blinkIdUiStore";
import { TimeoutModal } from "./TimeoutModal";
import { UnsupportedDocumentModal } from "./UnsupportedDocumentModal";

// `blinkIdUxManager` is not reactive
export const BlinkIdFeedbackUi: Component<{
  localization?: Partial<LocalizationStrings>;
}> = (props) => {
  const { store, updateStore } = blinkIdUiStore;

  // TODO: hacky, fix this
  // only used to map LOW_QUALITY_FRONT and LOW_QUALITY_BACK to SENSING_FRONT
  // and SENSING_BACK
  const [uiState, setUiState] = createSignal<BlinkIdUiState>(
    store.blinkIdUxManager.uiState,
  );

  // Handle errors during scanning
  createEffect(() => {
    const cleanup = store.blinkIdUxManager.addOnErrorCallback((errorState) => {
      updateStore({ errorState });
    });
    onCleanup(() => cleanup());
  });

  const playbackState = createWithSignal(cameraManagerStore)(
    (s) => s.playbackState,
  );

  const isProcessing = () => playbackState() === "capturing";

  // Processing is stopped, but we still want to show the feedback
  const shouldShowFeedback = () => {
    return (
      isProcessing() ||
      uiState().key === "SIDE_CAPTURED" ||
      uiState().key === "DOCUMENT_CAPTURED"
    );
  };

  createEffect(() => {
    const cleanup = store.blinkIdUxManager.addOnUiStateChangedCallback(
      (newUiState) => {
        let appliedUiState = newUiState;
        const key = newUiState.key;

        // Treat low quality input as processing to prevent flashes as they share
        // the same message and reticle

        // TODO: see if this can be handled in the mapping itself
        if (key === "LOW_QUALITY_FRONT") {
          appliedUiState = blinkIdUiStateMap.SENSING_FRONT;
        }
        if (key === "LOW_QUALITY_BACK") {
          appliedUiState = blinkIdUiStateMap.SENSING_BACK;
        }

        setUiState(appliedUiState);
      },
    );

    onCleanup(() => cleanup());
  });

  return (
    <div>
      <style
        id="blinkid-ux-manager-style"
        ref={(ref) => {
          if (window.__blinkidUxManagerCssCode) {
            ref.innerHTML = window.__blinkidUxManagerCssCode;
          }
        }}
      />
      {/* TODO: REMOVE */}
      <LocalizationProvider
        setLocalizationRef={() => void 0}
        userStrings={props.localization}
      >
        <TimeoutModal />
        <UnsupportedDocumentModal />

        <Show when={shouldShowFeedback()}>
          <UiFeedbackOverlay uiState={uiState()} />
        </Show>
      </LocalizationProvider>
    </div>
  );
};
