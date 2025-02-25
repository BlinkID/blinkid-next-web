/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import { Dialog } from "@ark-ui/solid/dialog";
import { Modal } from "@microblink/shared-components/Modal";
import { type Component } from "solid-js";
import { blinkIdUiStore } from "./blinkIdUiStore";

/**
 * This component displays a modal when the scanning times out due to low quality input.
 */
export const TimeoutModal: Component = () => {
  const { store, updateStore } = blinkIdUiStore;

  const modalVisible = () => store.errorState === "timeout";
  const hideModal = () => updateStore({ errorState: undefined });

  const dismountCameraManagerUi = () => {
    // Causes a race condition unless we use setTimeout
    // [@zag-js/core > transition] Cannot transition a stopped machine
    setTimeout(() => store.cameraManagerComponent.dismount(), 0);
  };

  let initialFocusEl!: HTMLButtonElement;

  return (
    <Modal
      mountTarget={store.cameraManagerComponent.overlayLayerNode}
      title="Scan unsuccessful"
      initialFocusEl={() => initialFocusEl}
      open={modalVisible()}
      actions={
        <div class="flex justify-center gap-4">
          <Dialog.CloseTrigger
            class="px-4 py-2 text-sm bg-white text-gray-800 rounded-10 hover:bg-gray-100
              transition-colors transition-duration-100 appearance-none border-none ring-1
              ring-gray-900"
            onClick={() => dismountCameraManagerUi()}
          >
            Cancel
          </Dialog.CloseTrigger>
          <button
            ref={initialFocusEl}
            class="px-4 py-2 text-sm bg-accent-500 text-white rounded-10 hover:bg-accent-600
              transition-colors appearance-none border-none"
            onClick={() => {
              hideModal();
              void store.blinkIdUxManager.cameraManager.startFrameCapture();
            }}
          >
            Retry
          </button>
        </div>
      }
    >
      <p class="mb-6 text-center text-balance">
        Unable to read the document. Please try again.
      </p>
    </Modal>
  );
};
