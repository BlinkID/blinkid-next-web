/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import { Dialog } from "@ark-ui/solid/dialog";
import { JSX, ParentComponent, Show } from "solid-js";
import { Portal } from "solid-js/web";
import { SmartEnvironmentProvider } from "./SmartEnvironmentProvider";

type ModalProps = {
  mountTarget: HTMLElement;
  title?: string;
  actions?: JSX.Element;
} & Dialog.RootProps;

export const Modal: ParentComponent<ModalProps> = (props) => {
  return (
    <SmartEnvironmentProvider>
      {() => (
        <Dialog.Root
          // prevent closing by clicking outside
          onFocusOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          restoreFocus
          unmountOnExit
          lazyMount
          // TODO: report bug to Ark UI
          // https://github.com/chakra-ui/zag/blob/a3ea8a50672aac3f25e5644d4708b9d8286a4302/CHANGELOG.md?plain=1#L1030C56-L1030C67
          // breaks focus trap
          // role="alertdialog"
          {...props}
        >
          {/* Ark UI renders an empty portal even if it's not open, which is why
          we need to wrap it in a <Show>
          https://github.com/chakra-ui/ark/discussions/3252
          */}
          <Show when={props.open}>
            <Portal mount={props.mountTarget}>
              <Dialog.Positioner class="h-vh supports-[(height:100dvh)]:h-dvh top-0 left-0 w-full fixed grid p-8">
                <Dialog.Backdrop class="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50" />
                <Dialog.Content
                  class="bg-white color-dark-9 p-6 rounded-lg shadow-lg place-self-center relative flex
                    flex-col max-h-[calc(100dvh-4rem)] max-w-md"
                >
                  {/* Title */}
                  <Show when={props.title}>
                    {(title) => (
                      <Dialog.Title class="text-size-5 font-semibold mb-4 text-center">
                        {title()}
                      </Dialog.Title>
                    )}
                  </Show>

                  {/* Main content */}
                  <div class="overflow-y-auto">{props.children}</div>

                  {/* Action buttons */}
                  <Show when={props.actions}>
                    <div>{props.actions}</div>
                  </Show>
                </Dialog.Content>
              </Dialog.Positioner>
            </Portal>
          </Show>
        </Dialog.Root>
      )}
    </SmartEnvironmentProvider>
  );
};
