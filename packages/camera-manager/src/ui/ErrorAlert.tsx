/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import { Dialog } from "@ark-ui/solid/dialog";
import { Component, Show } from "solid-js";
import { Portal } from "solid-js/web";

export const ErrorAlert: Component<{
  error: Error;
}> = (error) => {
  return (
    <Dialog.Root
      open
      unmountOnExit
      // onFocusOutside={(e) => e.preventDefault()}
    >
      <Portal>
        <Dialog.Positioner class="h-vh supports-[(height:100dvh)]:h-dvh top-0 left-0 w-full z-9999 fixed grid">
          <Dialog.Content
            aria-labelledby="dialog-title"
            class="bg-white color-dark-9 p-4 rounded-lg shadow-lg place-self-center relative z-20"
          >
            <Dialog.Title class="sr-only" id="dialog-title">
              Caught error: {error.error.name}
            </Dialog.Title>
            <Dialog.CloseTrigger>Close</Dialog.CloseTrigger>
            <p>{error.error.message}</p>
            <Show when={error.error.stack}>
              {(stack) => (
                <pre class="text-size-sm overflow-auto flex">{stack()}</pre>
              )}
            </Show>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
