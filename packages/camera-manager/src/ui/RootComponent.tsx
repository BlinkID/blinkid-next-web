/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

/* @refresh reload */

import { Component, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import { CaptureScreen, CaptureScreenPortalled } from "./CaptureScreen";

import { useCameraUiStore } from "./CameraUiStoreContext";
import { ErrorAlert } from "./ErrorAlert";
import { MOUNT_POINT_ID } from "./createCameraManagerUi";

const RootComponent: Component = () => {
  const { cameraManagerSolidStore, mountTarget } = useCameraUiStore();
  const errorState = cameraManagerSolidStore((x) => x.errorState);

  return (
    <>
      <Show when={errorState()}>
        {(error) => <ErrorAlert error={error()} />}
      </Show>

      <Dynamic
        component={
          (mountTarget as HTMLElement).id === MOUNT_POINT_ID
            ? CaptureScreenPortalled
            : CaptureScreen
        }
      />
    </>
  );
};

export { RootComponent };
