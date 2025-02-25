/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

/* @refresh reload */

import { BlinkIdResult, createBlinkIdUi } from "@microblink/blinkid-next";
import { Component, createSignal, onMount, Show } from "solid-js";
import { Traverse } from "neotraverse/modern";

export const App: Component = () => {
  const [result, setResult] = createSignal<BlinkIdResult>();

  const init = async () => {
    const blinkId = await createBlinkIdUi({
      licenseKey: import.meta.env.VITE_LICENCE_KEY,
    });

    blinkId.addOnResultCallback((result) => {
      setResult(result);
      void blinkId.destroy();
    });
  };

  onMount(() => void init());

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

  return (
    <div>
      <Show when={resultWithoutImages()}>
        {(trimmedResult) => (
          <pre>{JSON.stringify(trimmedResult(), null, 2)}</pre>
        )}
      </Show>
    </div>
  );
};
