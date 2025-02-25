/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import { SmartEnvironmentProvider } from "@microblink/shared-components/SmartEnvironmentProvider";
import { Component, createEffect, createSignal } from "solid-js";

import { Dialog } from "@ark-ui/solid/dialog";

import { useCameraUiStore } from "./CameraUiStoreContext";
import { Header } from "./Header";

import { SolidShadowRoot } from "./SolidShadowRoot";

import normalize from "@csstools/normalize.css?inline";
import { Portal } from "solid-js/web";
import { MOUNT_POINT_ID } from "./createCameraManagerUi";
import { useLocalization } from "./LocalizationContext";
import rootStyles from "./styles/root-styles.scss?inline";
import variables from "./styles/variables.scss?inline";
import { cameraUiRefSignalStore } from "./zustandRefStore";

// TODO: Full screen background

export const CaptureScreen: Component = () => {
  const { cameraManagerSolidStore, cameraManager, mountTarget } =
    useCameraUiStore();

  const [videoRef, setVideoRef] = createSignal<HTMLVideoElement>();
  // Reference to the feedback layer, using signals because of 1 tick rendering
  // delay due to attaching shadow root
  const [feedbackRef, setFeedbackRef] = createSignal<HTMLDivElement>();
  const [overlayLayerRef, setOverlayLayerRef] = createSignal<HTMLDivElement>();

  const mirrorX = cameraManagerSolidStore((x) => x.mirrorX);

  /** We use only 1 shadow root. If not portalled, enable SolidShadowRoot */
  const isPortalled = () => (mountTarget as HTMLElement).id === MOUNT_POINT_ID;

  createEffect(() => {
    // TODO: see if there is a better way to handle this
    // https://docs.solidjs.com/reference/jsx-attributes/ref
    // async rendering due to shadow root!
    const $videoRef = videoRef();
    const $feedbackRef = feedbackRef();
    const $overlayLayerRef = overlayLayerRef();

    if (!$videoRef || !$feedbackRef || !$overlayLayerRef) {
      return;
    }

    cameraUiRefSignalStore.setState({
      feedbackLayer: $feedbackRef,
      overlayLayer: $overlayLayerRef,
    });

    cameraManager.initVideoElement($videoRef);
  });

  return (
    <SolidShadowRoot
      // We disable the shadow root if the component is portalled as it's
      // already provided by the portal
      disableShadowRoot={isPortalled()}
      style={
        isPortalled()
          ? {
              height: "100%",
            }
          : undefined
      }
    >
      <style>{variables}</style>
      <style>{normalize}</style>
      <style>{rootStyles}</style>
      <style
        id="camera-manager-style"
        ref={(ref) => {
          if (window.__mbCameraManagerCssCode) {
            ref.innerHTML = window.__mbCameraManagerCssCode;
          }
        }}
      />

      <div
        class="bg-dark-500 color-white size-full relative min-h-[300px]"
        part="think-of-a-good-selector"
      >
        {/* Toolbar header */}
        <Header />

        {/* Video feed */}
        <video
          class="block absolute top-0 left-0 size-full object-contain"
          style={{
            transform: `scaleX(${mirrorX() ? -1 : 1})`,
          }}
          ref={setVideoRef}
        />

        {/* Feedback node used for showing UI messages during scanning */}
        <div
          ref={setFeedbackRef}
          class="absolute top-0 left-0 w-full h-full z-1"
          id="feedback-layer"
        />

        {/* Overlay node used for displaying dialogs */}
        <div
          ref={setOverlayLayerRef}
          // overlay layer is above the feedback layer and Header
          // `data-scope` is a hack to only apply z-index if there is a modal present inside this div
          // TODO: see if there is a better way to handle this
          // do we need full-screen overlay? (positioner only)
          class="absolute top-0 left-0 w-full h-full has-[[data-scope]]:z-2"
          id="overlay-layer"
        />
      </div>
    </SolidShadowRoot>
  );
};

export const CaptureScreenPortalled: Component = () => {
  const { t } = useLocalization();

  return (
    <Portal
      useShadow={true}
      mount={document.getElementById(MOUNT_POINT_ID)!}
      // TODO: see if there is a better way to handle this
      // TODO: add a way to customize the z-index
      ref={(ref) => {
        ref.style.zIndex = "1000";
        ref.style.position = "fixed";
        return ref;
      }}
    >
      <SmartEnvironmentProvider>
        {(rootNode) => (
          // TODO: see if we can use the modal property conditionally
          <Dialog.Root
            open
            lazyMount
            unmountOnExit
            // hack to prevent focusing any items, but focusing on the shadow root
            initialFocusEl={() => {
              const dummyNode = document.createElement("div");
              dummyNode.tabIndex = -1;
              rootNode.appendChild(dummyNode);
              setTimeout(() => {
                dummyNode.remove();
              });
              return dummyNode;
            }}
          >
            <Dialog.Positioner>
              <Dialog.Content
                aria-labelledby="dialog-title"
                class="h-vh supports-[(height:100dvh)]:h-dvh top-0 left-0 w-full fixed"
              >
                <Dialog.Title class="sr-only" id="dialog-title">
                  {/* TODO: localize/customize this */}
                  {t.modal_title}
                </Dialog.Title>
                <CaptureScreen />
              </Dialog.Content>
            </Dialog.Positioner>
          </Dialog.Root>
        )}
      </SmartEnvironmentProvider>
    </Portal>
  );
};
