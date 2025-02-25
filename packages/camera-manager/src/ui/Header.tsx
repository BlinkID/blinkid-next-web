/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Component, JSX, ParentComponent, Show } from "solid-js";
import CloseIcon from "~icons/material-symbols/close";
import FlashOff from "~icons/material-symbols/flash-off";
import FlashOn from "~icons/material-symbols/flash-on";
import MirrorIcon from "~icons/material-symbols/flip";
import { CameraSelector } from "./CameraSelector";
import { useCameraUiStore } from "./CameraUiStoreContext";
import { useLocalization } from "./LocalizationContext";

import { Tooltip } from "@ark-ui/solid/tooltip";
import { eventFixer } from "@microblink/shared-components/eventFixer";
import { SmartEnvironmentProvider } from "@microblink/shared-components/SmartEnvironmentProvider";
import { Portal } from "solid-js/web";

export const Header: Component = () => {
  const { dismountCameraUi, cameraManagerSolidStore } = useCameraUiStore();
  const { t } = useLocalization();
  const isMirrored = cameraManagerSolidStore((s) => s.mirrorX);
  const selectedCamera = cameraManagerSolidStore((s) => s.selectedCamera);
  const cameras = cameraManagerSolidStore((s) => s.cameras);
  const isActive = cameraManagerSolidStore((s) => s.playbackState !== "idle");

  // Same instance of selected camera, so we can't reuse `selectedCamera` signal
  // to trigger signal updates
  const torchEnabled = cameraManagerSolidStore(
    (s) => s.selectedCamera?.torchEnabled,
  );

  const hasTorch = () => selectedCamera()?.torchSupported;

  const toggleTorch = () => {
    const camera = selectedCamera();
    if (!camera) {
      return;
    }

    void camera.toggleTorch();
  };

  const mirrorX = () => {
    cameraManagerSolidStore.setState({
      mirrorX: !cameraManagerSolidStore.getState().mirrorX,
    });
  };

  return (
    <SmartEnvironmentProvider>
      {(rootNode) => (
        <div
          class={`z-2 relative gap-2 grid justify-between items-center grid-cols-[1fr_auto_1fr]
          py-4 color-white lerp:px-3@xs,8@lg`}
        >
          <div
            class={"justify-self-start flex flex-nowrap gap-4 auto-cols-auto"}
          >
            {/* Mirror button */}
            <Show when={isActive()}>
              <ToolbarButton
                tooltipLabel={t.mirror_camera}
                rootNode={rootNode}
                onClick={() => mirrorX()}
              >
                <span class="sr-only">{t.mirror_camera}</span>
                <MirrorIcon
                  class={
                    "size-6 shrink-0 transition-transform duration-300 ease-in-out"
                  }
                  style={{
                    transform: isMirrored() ? "scaleX(-1)" : "scaleX(1)",
                  }}
                />
              </ToolbarButton>
            </Show>

            {/* Torch */}
            <Show when={hasTorch() && isActive()}>
              <ToolbarButton
                onClick={() => toggleTorch()}
                rootNode={rootNode}
                tooltipLabel={t.torch}
              >
                <Show when={!torchEnabled()}>
                  <span class="sr-only">{t.torch}</span>
                  <FlashOn class="size-6 shrink-0" />
                </Show>
                <Show when={torchEnabled()}>
                  <FlashOff class="size-6 shrink-0" />
                </Show>
              </ToolbarButton>
            </Show>
          </div>

          {/* camera selector */}
          <div class="justify-self-center min-w-0 w-full">
            <Show when={cameras().length > 1}>
              <CameraSelector />
            </Show>
          </div>

          <div class="justify-self-end">
            {/* close button */}
            <ToolbarButton
              onClick={() => dismountCameraUi()}
              rootNode={rootNode}
              tooltipLabel={t.close}
            >
              <span class="sr-only">{t.close}</span>
              <CloseIcon class="size-6 shrink-0" />
            </ToolbarButton>
          </div>
        </div>
      )}
    </SmartEnvironmentProvider>
  );
};

type ToolbarButtonProps = {
  tooltipLabel: string;
  rootNode: Node;
} & JSX.ButtonHTMLAttributes<HTMLButtonElement>;

const ToolbarButton: ParentComponent<ToolbarButtonProps> = (props) => {
  return (
    <Tooltip.Root>
      {/* Button */}
      <Tooltip.Trigger
        {...props}
        asChild={(tooltipProps) => {
          return (
            <button
              {...eventFixer(tooltipProps())}
              class={`rounded-full bg-dark-500 bg-opacity-50 backdrop-blur grid place-items-center
              size-12 appearance-none border-none cursor-pointer`}
            >
              {props.children}
            </button>
          );
        }}
      />
      {/* Tooltip */}
      <Portal mount={props.rootNode}>
        <Tooltip.Positioner>
          <Tooltip.Content
            class={`bg-dark-500 bg-opacity-50 backdrop-blur color-white text-align-center p-2
              rounded-md text-sm drop-shadow-md`}
          >
            {props.tooltipLabel}
          </Tooltip.Content>
        </Tooltip.Positioner>
      </Portal>
    </Tooltip.Root>
  );
};
