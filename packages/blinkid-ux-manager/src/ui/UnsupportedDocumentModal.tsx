/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import { Modal } from "@microblink/shared-components/Modal";
import { type Component } from "solid-js";
import { blinkIdUiStore } from "./blinkIdUiStore";

export const UnsupportedDocumentModal: Component = () => {
  const { store, updateStore } = blinkIdUiStore;

  const modalVisible = () => store.errorState === "unsupported-document";
  const hideModal = () => updateStore({ errorState: undefined });

  let initialFocusEl!: HTMLButtonElement;

  const dismountCameraManagerUi = () => {
    // TODO: check if everything is dismounted and unloaded
    store.cameraManagerComponent.dismount();
  };

  const restartScanning = async () => {
    hideModal();
    await store.blinkIdUxManager.blinkIdCore.resetScanningSession();
    await store.blinkIdUxManager.cameraManager.startFrameCapture();
  };

  return (
    <Modal
      mountTarget={store.cameraManagerComponent.overlayLayerNode}
      title="Document not recognized"
      initialFocusEl={() => initialFocusEl}
      open={modalVisible()}
      actions={
        <div class="flex justify-center gap-4">
          <button
            class="px-4 py-2 text-sm bg-white text-gray-800 rounded-10 hover:bg-gray-100
              transition-colors transition-duration-100 appearance-none border-none ring-1
              ring-gray-900"
            onClick={() => {
              dismountCameraManagerUi();
            }}
          >
            Cancel
          </button>
          <button
            ref={initialFocusEl}
            class="px-4 py-2 text-sm bg-accent-500 text-white rounded-10 hover:bg-accent-600
              transition-colors appearance-none border-none"
            onClick={() => void restartScanning()}
          >
            Retry
          </button>
        </div>
      }
    >
      <p class="mb-6">Scan the front side of a supported document.</p>
    </Modal>
  );
};
