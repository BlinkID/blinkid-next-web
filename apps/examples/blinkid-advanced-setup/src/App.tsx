/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

/* @refresh reload */

import { BlinkIdResult, createBlinkIdCore } from "@microblink/blinkid-core";
import {
  BlinkIdUxManager,
  createBlinkIdFeedbackUi,
} from "@microblink/blinkid-ux-manager";
import {
  CameraManager,
  createCameraManagerUi,
} from "@microblink/camera-manager";

import { Component, createSignal, onMount, Show } from "solid-js";
import { ScoreDisplay } from "./ScoreDisplay";

import { Traverse } from "neotraverse/modern";

const SHOW_DEBUG = true;
const USE_PORTAL = true;

const targetNode = !USE_PORTAL ? document.getElementById("root")! : undefined;

export const App: Component = () => {
  const [result, setResult] = createSignal<BlinkIdResult>();
  const [blinkIdUxManager, setBlinkIdUxManager] =
    createSignal<BlinkIdUxManager>();

  /**
   * This function removes the images from the result object
   */
  const resultWithoutImages = () => {
    const resultCopy = structuredClone(result());

    new Traverse(resultCopy).forEach((ctx, value) => {
      if (value instanceof Uint8Array) {
        ctx.update(new Uint8Array());
      }
    });

    return resultCopy;
  };

  onMount(() => {
    void (async () => {
      // we first initialize the direct API. This loads the WASM module and initializes the engine
      const blinkIdCore = await createBlinkIdCore({
        licenseKey: import.meta.env.VITE_LICENCE_KEY,

        blinkIdSettings: {
          recognitionModeFilter: {
            enableMrzId: false,
            enableMrzPassport: false,
            enableMrzVisa: false,
            enablePhotoId: false,
            enableBarcodeId: false,
            enableFullDocumentRecognition: true,
          },
        },
      });

      // we create the camera manager
      const cameraManager = new CameraManager();

      // we create the UX manager
      const blinkIdUxManager = new BlinkIdUxManager(cameraManager, blinkIdCore);

      setBlinkIdUxManager(blinkIdUxManager);

      // this creates the UI and attaches it to the DOM
      const cameraUi = await createCameraManagerUi(cameraManager, targetNode);

      // this creates the feedback UI and attaches it to the camera UI
      createBlinkIdFeedbackUi(blinkIdUxManager, cameraUi);

      blinkIdUxManager.addOnResultCallback((result) => {
        setResult(result);
        cameraUi.dismount();
      });

      await cameraManager.startCameraStream();
      await cameraManager.startFrameCapture();
    })();
  });

  return (
    <div>
      {/* debug */}
      <Show when={SHOW_DEBUG && blinkIdUxManager() && !resultWithoutImages()}>
        <ScoreDisplay blinkIdUxManager={blinkIdUxManager()!} />
      </Show>

      {/* results */}
      <Show when={resultWithoutImages()}>
        {(trimmedResult) => (
          <pre>{JSON.stringify(trimmedResult(), null, 2)}</pre>
        )}
      </Show>
    </div>
  );
};
