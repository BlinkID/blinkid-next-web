/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import { ConnectionObserver } from "@wessberg/connection-observer";
import { rad, radEventListener } from "rad-event-listener";

import { Camera, FacingMode } from "./Camera";
import {
  createCameras,
  findIdealCamera,
  getCameraDevices,
} from "./cameraUtils";

import {
  PlaybackState,
  resetCameraManagerStore as resetStore,
  cameraManagerStore as store,
} from "./cameraManagerStore";

import { asError } from "./utils";
import { videoToImageData } from "./videoToImageData";

export type FrameCaptureCallback = (frame: ImageData) => void | Promise<void>;

/**
 * Available video resolutions for the camera stream.
 */
export const videoResolutions = {
  HD: { width: 1280, height: 720 },
  FHD: { width: 1920, height: 1080 },
  UHD: { width: 3840, height: 2160 },
};

export type VideoResolution = keyof typeof videoResolutions;

export type CameraPreference =
  | { preferredCamera: Camera; preferredFacing?: never }
  | { preferredFacing: FacingMode; preferredCamera?: never }
  | { preferredCamera?: never; preferredFacing?: never };

export class CameraManager {
  // TODO: should these be in zustand?
  #resolution: VideoResolution = "FHD";

  #resumeRequest?: Exclude<PlaybackState, "idle">;
  #videoFrameRequestId:
    | ReturnType<HTMLVideoElement["requestVideoFrameCallback"]>
    | undefined;

  #eventListenerCleanup?: () => void;

  /**
   * Callbacks that will be triggered on each frame when the playback state is
   * "capturing".
   */
  #frameCaptureCallbacks = new Set<FrameCaptureCallback>();

  /**
   * Sets the resolution of the camera stream
   */
  setResolution = async (resolution: VideoResolution) => {
    this.#resolution = resolution;

    const playbackState = this.getState().playbackState;

    if (playbackState !== "idle") {
      this.#resumeRequest = playbackState;
      this.stopStream();
      await this.startCameraStream();
    }
  };

  get resolution() {
    return this.#resolution;
  }

  /**
   * True if there is a video playing or capturing
   * TODO: see if we can simplify this, by observing the video playback state
   */
  get isActive() {
    return store.getState().playbackState !== "idle";
  }

  setFacingFilter(facingFilter: FacingMode[]) {
    store.setState({
      facingFilter,
    });
  }

  /**
   * Returns the cameras that are available to the user, filtered by the facing mode.
   * If no facing mode is set, all cameras are returned.
   */
  getCameras() {
    // TODO: refresh cameras if none available
    const allCameras = store.getState().cameras;
    const facingFilter = store.getState().facingFilter;

    if (!allCameras.length) {
      console.warn(
        "No cameras available, try calling refreshCameraDevices first",
      );
    }

    if (!facingFilter) {
      return allCameras;
    }

    const filteredCameras = allCameras.filter((camera) =>
      facingFilter.includes(camera.facingMode),
    );

    return filteredCameras;
  }

  /**
   * Single-time setup for a video element
   */
  initVideoElement(videoElement: HTMLVideoElement) {
    if (!(videoElement instanceof HTMLVideoElement)) {
      throw new Error(
        `Expected an HTMLVideoElement, got ${typeof videoElement}`,
        {
          cause: videoElement,
        },
      );
    }

    store.setState({
      videoElement,
    });

    const videoEventCleanup = rad(videoElement, (add) => {
      const events: (keyof HTMLVideoElementEventMap)[] = [
        "abort",
        // "error",
        // "canplay",
        // "canplaythrough",
        // "loadeddata",
        // "loadedmetadata",
        // "play",
        // "playing",
        // "pause",
        // "waiting",
        // "seeking",
        // "seeked",
        // "ended",
        // "stalled",
        // "suspend",
        // "timeupdate",
        // "ratechange",
        // "durationchange",
      ];
      events.forEach((event) => {
        add(event, () => {
          console.debug(`Video event: ${event}`);
        });
      });
    });

    // video disconnect / dismount callback
    const connectionObserver = new ConnectionObserver((entries) => {
      if (!entries[0].connected) {
        this.deinitVideoElement();
      }
    });
    connectionObserver.observe(videoElement);

    // set up video for autoplay
    videoElement.setAttribute("playsInline", "");
    videoElement.setAttribute("muted", "");
    videoElement.controls = false;

    const cleanupVisibilityListener = radEventListener(
      document,
      "visibilitychange",
      () => {
        if (document.hidden && this.isActive) {
          this.stopStream();
        } else {
          void this.startCameraStream();
        }
      },
    );

    this.#eventListenerCleanup = () => {
      cleanupVisibilityListener();
      videoEventCleanup();
    };
  }

  /**
   * Adds a callback that will be triggered on each frame when the playback state
   * is "capturing".
   *
   * @param frameCaptureCallback
   * @returns a cleanup function to remove the callback
   */
  addFrameCaptureCallback(frameCaptureCallback: FrameCaptureCallback) {
    this.#frameCaptureCallbacks.add(frameCaptureCallback);
    return () => this.#frameCaptureCallbacks.delete(frameCaptureCallback);
  }

  deinitVideoElement() {
    this.#eventListenerCleanup?.();
    store.setState({
      videoElement: undefined,
    });
    this.stopStream();
  }

  /**
   * Select a camera device from available ones.
   */
  async selectCamera(camera: Camera) {
    // DOES NOT MODIFY playbackState

    // if playing or capturing frames, we need to resume after we're done swapping
    const playbackState = store.getState().playbackState;

    if (playbackState !== "idle") {
      this.#resumeRequest = playbackState;
    }

    const state = store.getState();

    // no-op if we're already selected
    if (state.selectedCamera === camera) {
      console.debug("Already selected");
      return;
    }

    // prevent race conditions
    if (state.isSwappingCamera) {
      console.debug("Already swapping");
      return;
    }

    store.setState({
      isSwappingCamera: true,
    });

    // stop the previous camera stream if it exists
    if (state.selectedCamera?.activeStream) {
      console.debug("Stopping previous stream");
      state.selectedCamera.stopStream();
    }

    // clear the video element source
    if (state.videoElement) {
      state.videoElement.srcObject = null;
    }

    store.setState({
      selectedCamera: camera,
      isSwappingCamera: false,
    });

    if (this.#resumeRequest === "playback") {
      console.debug("Starting new stream");
      await this.startPlayback();
    }

    if (this.#resumeRequest === "capturing") {
      console.debug("Resuming frame capture");
      await this.startFrameCapture();
    }

    // remove the resume request
    this.#resumeRequest = undefined;
  }

  /**
   * Refreshes available devices on the system and updates the state.
   */
  async refreshCameraDevices() {
    // prevent race conditions
    if (
      store.getState().isQueryingCameras ||
      store.getState().isSwappingCamera
    ) {
      console.debug("Already querying cameras");
      return;
    }

    store.setState({
      isQueryingCameras: true,
    });

    //TODO: getCameraDevices vs getCameras? Method vs function?
    const availableCameras = await getCameraDevices();
    const cameras = createCameras(availableCameras);

    cameras.forEach((camera) => {
      // avoid reassigning listeners
      if (camera.notifyStateChange) {
        return;
      }

      camera.notifyStateChange = (camInstance, reason) => {
        // TODO: Why does `queueMicrotask` or `setTimeout` work here?
        window.queueMicrotask(() => {
          store.setState({
            cameras: [...store.getState().cameras],
          });

          const selectedCamera = store.getState().selectedCamera;

          if (!selectedCamera) {
            return;
          }

          let streamError: Error | undefined;

          if (
            typeof reason === "object" &&
            reason !== null &&
            "payload" in reason &&
            reason.payload === "TRACK_END"
          ) {
            streamError = new Error("Camera stream ended unexpectedly");
          }

          if (camInstance === selectedCamera) {
            store.setState({
              selectedCamera,
              errorState: streamError,
            });
          }
        });
      };
    });

    store.setState({
      cameras: cameras,
      isQueryingCameras: false,
    });
  }

  /**
   * Starts the video playback
   *
   * @returns resolves when playback starts
   */
  async startPlayback() {
    const state = store.getState();

    // No-op if we're already playing.
    if (this.isActive && !this.#resumeRequest) {
      // console.debug("Already playing");
      return;
    }

    if (!state.videoElement) {
      console.warn("Starting playback - no video element present.");
      return;
    }

    if (!state.selectedCamera) {
      console.warn("Select a camera first.");
      return;
    }

    // assign new stream if it doesn't exist
    if (!state.selectedCamera.activeStream) {
      const stream = await state.selectedCamera.startStream(this.resolution);
      state.videoElement.srcObject = stream;
    }

    try {
      await state.videoElement.play();
      store.setState({
        playbackState: "playback",
      });
    } catch (error) {
      console.error("Failed to start playback", error);
      store.setState({
        errorState: asError(error),
      });
      throw error;
    }
  }

  /**
   * Starts playback and frame capturing.
   */
  async startFrameCapture() {
    const state = store.getState();

    // No-op if we're already capturing frames
    if (
      state.playbackState === "capturing" &&
      this.#resumeRequest !== "capturing"
    ) {
      return;
    }
    // otherwise, we're resuming or starting

    if (!state.videoElement) {
      console.warn("Missing video element");
      return;
    }

    if (!state.selectedCamera) {
      console.warn(
        "No active camera! Select a camera first, or use `startCameraStream`",
      );
      return;
    }

    await this.startPlayback();

    store.setState({
      playbackState: "capturing",
    });

    this.#videoFrameRequestId = state.videoElement.requestVideoFrameCallback(
      () => void this.#loop(),
    );

    this.#resumeRequest = undefined;
  }

  /**
   * Starts a best-effort camera stream. Will pick a camera automatically if
   * none is selected.
   * TODO: Rename method
   */
  async startCameraStream({
    autoplay = true,
    preferredCamera,
    preferredFacing,
  }: {
    autoplay?: boolean;
  } & CameraPreference = {}) {
    const videoElement = store.getState().videoElement;

    if (!videoElement) {
      console.warn("Can't start stream without a video element");
      return;
    }

    if (this.isActive && !this.#resumeRequest) {
      console.warn("Already streaming");
      return;
    }

    // Use the preferred camera if provided
    if (preferredCamera) {
      await this.selectCamera(preferredCamera);
    }

    const hasCameras = () => store.getState().cameras.length > 0;

    // Select a camera if none is selected
    if (!store.getState().selectedCamera) {
      console.debug("Searching for a best camera");
      try {
        // get the cameras if we don't have them
        if (!hasCameras()) {
          await this.refreshCameraDevices();
        }
        // still no devices
        if (!hasCameras()) {
          throw new Error("No cameras found");
        }

        // This returns a list of cameras filtered by facing mode
        const cameras = this.getCameras();
        const selectedCamera = await findIdealCamera(
          cameras,
          this.resolution,
          preferredFacing,
        );
        await this.selectCamera(selectedCamera);
      } catch (error) {
        store.setState({
          errorState: asError(error),
        });
        throw error;
      }
    }

    // capture new state as it's been modified
    const selectedCamera = store.getState().selectedCamera;

    // something went wrong during camera selection?
    if (!selectedCamera) {
      console.warn("No selected camera!");
      throw new Error("No selected camera");
    }

    const stream = await selectedCamera.startStream(this.#resolution);

    if (!videoElement.isConnected) {
      throw new Error("Video element needs to be in the document!");
    }

    videoElement.srcObject = stream;

    store.setState({
      // We mirror the video if the camera is front-facing. Assume that desktop
      // devices don't return a facing mode and that they are front-facing.
      mirrorX: selectedCamera.facingMode !== "back",
      videoElement,
    });

    if (autoplay) {
      await this.startPlayback();
    }
  }

  /**
   * Pauses capturing frames without pausing playback.
   */
  stopFrameCapture() {
    store.setState({
      playbackState: "playback",
    });
  }

  /**
   * Stops the currently active stream. Also stops the video playback and capturing process.
   */
  stopStream() {
    console.debug("stopStream called");
    const state = store.getState();
    this.pausePlayback();

    state.selectedCamera?.stopStream();

    if (!state.videoElement) {
      return;
    }

    state.videoElement.srcObject = null;
  }

  /**
   * Pauses the video playback. This will also stop the capturing process.
   */
  pausePlayback() {
    console.debug("pausePlayback called");
    const video = store.getState().videoElement;

    store.setState({
      playbackState: "idle",
    });

    if (!video) {
      return;
    }

    if (this.#videoFrameRequestId) {
      video.cancelVideoFrameCallback(this.#videoFrameRequestId);
    }

    video.pause();
  }

  /**
   * The main recognition loop
   * @private
   * @internal
   */
  #loop() {
    const state = store.getState();

    if (state.playbackState !== "capturing") {
      return;
    }

    if (!state.videoElement) {
      // shouldn't happen as disconnecting is handled by an observer which will
      // pause the loop
      console.error("Missing video element");
      return;
    }

    if (this.#frameCaptureCallbacks.size !== 0) {
      const capturedFrame = videoToImageData(state.videoElement);

      this.#frameCaptureCallbacks.forEach((callback) => {
        void callback(capturedFrame);
      });
    }

    this.#videoFrameRequestId = state.videoElement.requestVideoFrameCallback(
      () => void this.#loop(),
    );
  }

  /**
   * If true, the video and captured frames will be mirrored horizontally.
   * TODO: apply when needed
   */
  setMirrorX(mirrorX: boolean) {
    store.setState({
      mirrorX,
    });
  }

  // The "typeof" is necessary to avoid a circular dependency when resolving types

  /**
   * Allows the user to subscribe to state changes inside the Camera Manager.
   * Implemented using Zustand. For usage information, see
   * {@link https://github.com/pmndrs/zustand#using-subscribe-with-selector}
   */
  subscribe: typeof store.subscribe = store.subscribe;

  /**
   * Gets the current internal state of the CameraManager.
   */
  getState: typeof store.getState = store.getState;

  /**
   * Resets the CameraManager and stop all streams
   */
  destroy() {
    console.debug("Destroying camera manager");
    this.#frameCaptureCallbacks.clear();
    resetStore();
  }
}
