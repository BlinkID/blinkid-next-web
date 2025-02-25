/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import {
  createContext,
  onCleanup,
  ParentComponent,
  useContext,
} from "solid-js";
import { MountableElement } from "solid-js/web";
import { createWithSignal } from "solid-zustand";
import { CameraManager } from "../core/CameraManager";
import { cameraManagerStore } from "../core/cameraManagerStore";

const CameraUiStoreContext = createContext<CameraUiStore>();
const cameraManagerSolidStore = createWithSignal(cameraManagerStore);

export type CameraUiStore = {
  /** Function which will dismount the component */
  dismountCameraUi: () => void;
  cameraManager: CameraManager;
  /** This is the camera manager zustand store converted to SolidJS' signal store via `solid-zustand` */
  cameraManagerSolidStore: typeof cameraManagerSolidStore;
  mountTarget: MountableElement;
};

export const CameraUiStoreProvider: ParentComponent<{
  dismountCameraUi: () => void;
  cameraManager: CameraManager;
  mountTarget: MountableElement;
}> = (props) => {
  // initial context value
  const contextValue: CameraUiStore = {
    cameraManagerSolidStore,
    // eslint-disable-next-line solid/reactivity
    cameraManager: props.cameraManager,
    // eslint-disable-next-line solid/reactivity
    dismountCameraUi: () => {
      // We need to delay the dismount to give time for cleanups to run
      setTimeout(() => {
        props.dismountCameraUi();
      }, 0);
    },
    // eslint-disable-next-line solid/reactivity
    mountTarget: props.mountTarget,
  };

  onCleanup(() => {
    console.debug("CameraUiStoreProvider cleanup");
    // props.dismount();  // this is recursive!!!
  });

  return (
    <CameraUiStoreContext.Provider value={contextValue}>
      {props.children}
    </CameraUiStoreContext.Provider>
  );
};

export function useCameraUiStore() {
  const ctx = useContext(CameraUiStoreContext);
  if (!ctx) {
    throw new Error("StoreContext.Provider not in scope");
  }

  return ctx;
}
