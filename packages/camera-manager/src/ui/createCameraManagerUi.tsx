/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import { render } from "solid-js/web";

import { SetStoreFunction } from "solid-js/store";
import { CameraManager } from "../core/CameraManager";
import { CameraUiStoreProvider } from "./CameraUiStoreContext";
import {
  LocalizationProvider,
  CameraUiLocalizationStrings,
} from "./LocalizationContext";
import { RootComponent } from "./RootComponent";
import { cameraUiRefStore } from "./zustandRefStore";

export const MOUNT_POINT_ID = "camera-manager-mount-point";

// this triggers extraction of CSS from the UnoCSS plugin
import "uno.css";

export type CameraManagerComponent = {
  cameraManager: CameraManager;
  /** Updates the localization strings */
  updateLocalization: SetStoreFunction<CameraUiLocalizationStrings>;
  // TODO: Doesn't currently unload the SDK. Fix this!
  /** Dismounts the component from the DOM and unloads the SDK */
  dismount: () => void;
  /** Sets a callback to be called when the component is unmounted */
  addOnDismountCallback: (fn: DismountCallback) => void;
  /** Removes a callback that was set with `addOnDismountCallback` */
  removeOnDismountCallback: (fn: DismountCallback) => void;
  /**
   * The feedback layer node that can be used to append custom feedback elements
   */
  feedbackLayerNode: HTMLDivElement;
  /**
   * The overlay layer node that can be used to append custom overlay elements
   */
  overlayLayerNode: HTMLDivElement;
};

type DismountCallback = () => void;

/**
 * Creates a new Camera Manager UI component.
 */
export function createCameraManagerUi(
  cameraManager: CameraManager,
  target?: HTMLElement,
) {
  let mountTarget: HTMLElement;
  const dismountCallbacks = new Set<DismountCallback>();

  // A reference to the `updateLocalization` function inside the `LocalizationProvider`
  let updateLocalizationRef!: SetStoreFunction<CameraUiLocalizationStrings>;

  // This function is called by the `LocalizationProvider` to lift the state update function up
  const setLocalizationRef = (
    setter: SetStoreFunction<CameraUiLocalizationStrings>,
  ) => {
    updateLocalizationRef = setter;
  };

  const cleanupCameraManager = () => {
    cameraManager.destroy();
  };

  // This function will unmount the component and remove the mount point from the DOM
  const unmountCameraManagerUi = () => {
    try {
      console.debug("🧱 Dismounting camera manager UI");
      for (const callback of dismountCallbacks) {
        callback();
      }
      dismountCallbacks.clear();

      // We need to delay the dismount to give time for cleanups to run

      setTimeout(() => {
        dismountRef();
        mountTarget.remove();
      }, 0);

      cleanupCameraManager();
    } catch (e) {
      console.warn("Error while dismounting camera manager UI", e);
      // component is already unmounted
    }
  };

  /* We create a dummy element that will be the target of the `dismount()`
   * function if no target is provided. If we simply provide `document.body`,
   * `dismount()` will clear the entire document body:
   *
   * https://www.solidjs.com/docs/latest/api#render
   *
   * This is a DX optimization so that users don't need to provide their own
   * dummy mount points if they are using a portalled component anyway
   */

  if (target) {
    mountTarget = target;
  } else {
    const newMountTarget = document.createElement("div");
    newMountTarget.id = MOUNT_POINT_ID;
    document.body.appendChild(newMountTarget);
    mountTarget = newMountTarget;
  }

  /*
   * TODO: unportalled version will erase entire `mountTarget`, we need to add a
   * dummy mount point here as well
   */
  const dismountRef = render(
    () => (
      <LocalizationProvider setLocalizationRef={setLocalizationRef}>
        <CameraUiStoreProvider
          dismountCameraUi={unmountCameraManagerUi}
          cameraManager={cameraManager}
          mountTarget={mountTarget}
        >
          <RootComponent />
        </CameraUiStoreProvider>
      </LocalizationProvider>
    ),
    mountTarget,
  );

  // The exposed API for the component
  const exposedComponentApi: CameraManagerComponent = {
    updateLocalization: updateLocalizationRef,
    addOnDismountCallback: (fn: DismountCallback) => {
      dismountCallbacks.add(fn);
    },
    removeOnDismountCallback: (fn: DismountCallback) => {
      dismountCallbacks.delete(fn);
    },
    cameraManager,
    // we know these are defined because `createCameraManagerUi` resolves when they are defined
    // TODO: maybe don't use getters but make sure they are defined
    get feedbackLayerNode() {
      return cameraUiRefStore.getState().feedbackLayer;
    },
    get overlayLayerNode() {
      return cameraUiRefStore.getState().overlayLayer;
    },
    dismount: unmountCameraManagerUi,
  };

  // resolve when all refs are ready due to potential reparenting of shadow roots
  return new Promise<CameraManagerComponent>((resolve) => {
    let videoExists = false;
    let feedbackExists = false;
    let overlayExists = false;

    // Initialize with no-op functions
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    let unsubscribeFeedbackLayer = () => {};
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    let unsubscribeOverlayLayer = () => {};
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    let unsubscribeVideo = () => {};

    const checkReady = () => {
      if (videoExists && feedbackExists && overlayExists) {
        unsubscribeFeedbackLayer();
        unsubscribeOverlayLayer();
        unsubscribeVideo();
        resolve(exposedComponentApi);
      }
    };

    // Assign the actual unsubscribe functions
    unsubscribeFeedbackLayer = cameraUiRefStore.subscribe(
      (x) => x.feedbackLayer,
      (feedbackLayer) => {
        if (feedbackLayer) {
          feedbackExists = true;
        }
        checkReady();
      },
      {
        fireImmediately: true,
      },
    );

    unsubscribeOverlayLayer = cameraUiRefStore.subscribe(
      (x) => x.overlayLayer,
      (overlayLayer) => {
        if (overlayLayer) {
          overlayExists = true;
        }
        checkReady();
      },
      {
        fireImmediately: true,
      },
    );

    unsubscribeVideo = cameraManager.subscribe(
      (state) => state.videoElement,
      (videoElement) => {
        if (videoElement) {
          videoExists = true;
          checkReady();
        }
      },
      {
        fireImmediately: true,
      },
    );
  });
}
