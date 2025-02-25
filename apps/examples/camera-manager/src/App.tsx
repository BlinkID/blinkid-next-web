/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

/* @refresh reload */

import {
  CameraManager,
  createCameraManagerUi,
} from "@microblink/camera-manager";
import { Component, onCleanup, onMount } from "solid-js";
import { FPS } from "yy-fps";

const DEBUG_FPS = false;
const PORTAL = true;

export const App: Component = () => {
  const cameraManager = new CameraManager();

  let fps: FPS | null = null;

  const initialize = async () => {
    await createCameraManagerUi(
      cameraManager,
      !PORTAL ? document.getElementById("root")! : undefined,
    );

    // cameraManager.setFacingFilter(["back", undefined]);
    await cameraManager.startCameraStream();

    if (DEBUG_FPS) {
      fps = new FPS({
        FPS: 30,
      });
      const countFps = () => fps!.frame();
      const removeCallback = cameraManager.addFrameCaptureCallback(countFps);
      await cameraManager.startFrameCapture();

      onCleanup(() => {
        fps?.remove();
        removeCallback();
      });
    }
  };

  onMount(() => {
    void initialize();
  });

  return (
    <div>
      <button onClick={() => void initialize()}>Scan</button>
    </div>
  );
};
