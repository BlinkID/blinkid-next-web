/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import { VideoResolution } from "./CameraManager";
import { isBackCameraName, isFrontCameraName } from "./cameraNames";
import { closeStreamTracks, createConstraints } from "./cameraUtils";

export type FacingMode = "front" | "back" | undefined;

/**
 * Represents a camera device and its active stream.
 */
export class Camera {
  deviceInfo: InputDeviceInfo;
  /**
   * Stream capabilities as reported by the stream.
   *
   * On iOS it's the same as `deviceCapabilities`. Firefox is only reporting
   * rudimentary capabilities, so we can't rely on this for picking the right
   * camera.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/getCapabilities
   */
  streamCapabilities?: ReturnType<MediaStreamTrack["getCapabilities"]>;
  activeStream: MediaStream | undefined;
  name: string;
  facingMode: FacingMode;
  torchSupported = false;
  torchEnabled = false;
  singleShotSupported = false;

  original = this;

  notify: (reason?: unknown) => void;
  notifyStateChange?: (camera: Camera, reason?: unknown) => void;

  /**
   * Device capabilities as reported by the device.
   *
   * Not available on Firefox.
   * Chrome doesn't report the torch capability, so we have to check for it on the stream.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/InputDeviceInfo/getCapabilities
   *
   * @deprecated Not used. Reconsider using once Firefox and Chrome align on this.
   */
  #deviceCapabilities?: ReturnType<InputDeviceInfo["getCapabilities"]>;

  constructor(deviceInfo: InputDeviceInfo) {
    if (deviceInfo.kind !== "videoinput") {
      throw new Error("Device is not a video input device");
    }

    this.deviceInfo = deviceInfo;
    this.name = deviceInfo.label;

    if (isFrontCameraName(deviceInfo.label)) {
      this.facingMode = "front";
    }

    if (isBackCameraName(deviceInfo.label)) {
      this.facingMode = "back";
    }

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const originalRef = this;

    // Apply the proxy to the instance
    const proxy = new Proxy(this, {
      set(target, property, value, receiver) {
        const oldValue = Reflect.get(target, property, receiver);

        const change = {
          property,
          oldValue,
          value,
        };

        originalRef.notify(change);

        return Reflect.set(target, property, value, receiver);
      },
    });

    this.notify = (reason?: unknown) => {
      this.notifyStateChange?.(proxy, reason);
    };

    // randomly rename the camera every 1-2 seconds
    // setInterval(
    //   () => {
    //     proxy.name = `${deviceInfo.label} ${Math.random()}`;
    //   },
    //   Math.random() * 1000 + 1000,
    // );

    return proxy;
  }

  async startStream(resolution: VideoResolution) {
    if (this.activeStream) {
      return this.activeStream;
    }

    const constraints = createConstraints(
      resolution,
      this.facingMode,
      this.deviceInfo.deviceId,
    );

    // can throw if device is currently in use by another process
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    this.streamCapabilities = stream.getVideoTracks()[0].getCapabilities();

    this.activeStream = stream;

    const videoTrack = stream.getVideoTracks()[0];

    if ("torch" in this.streamCapabilities) {
      this.torchSupported = true;
    }

    if (
      "focusMode" in this.streamCapabilities &&
      this.streamCapabilities.focusMode?.includes("single-shot")
    ) {
      this.singleShotSupported = true;
    }

    // check for front/back mismatch and correct it
    if (
      this.facingMode === "front" &&
      this.streamCapabilities.facingMode?.includes("environment")
    ) {
      this.facingMode = "back";
      console.warn("Front camera selected, but facingMode is environment");
    }

    if (
      this.facingMode === "back" &&
      this.streamCapabilities.facingMode?.includes("user")
    ) {
      this.facingMode = "front";
      console.warn("Back camera selected, but facingMode is user");
    }

    // no facing mode present on construction
    if (!this.facingMode) {
      if (this.streamCapabilities.facingMode?.includes("environment")) {
        this.facingMode = "back";
      }
      if (this.streamCapabilities.facingMode?.includes("user")) {
        this.facingMode = "front";
      }
    }

    // Happens when camera device disconnects
    videoTrack.onended = (e) => {
      this.stopStream();
      // TODO: write a better API for this
      this.notify({
        event: e,
        payload: "TRACK_END",
      });
    };

    return stream;
  }

  async toggleTorch() {
    const videoTrack = this.getVideoTrack();

    if (!videoTrack) {
      throw new Error("No active stream on Camera instance.");
    }

    if (!this.torchSupported) {
      throw new Error("Torch not supported on this device.");
    }

    try {
      await videoTrack.applyConstraints({
        advanced: [
          {
            torch: !this.torchEnabled,
          },
        ],
      });
      this.torchEnabled = !this.torchEnabled;
    } catch (error) {
      console.error("Failed to toggle torch", error);
      // TODO: check assumption - can it fail even if supported?
      this.torchEnabled = false;
      this.torchSupported = false;
      throw new Error("Failed to toggle torch", { cause: error });
    }

    return this.torchEnabled;
  }

  stopStream() {
    if (this.activeStream) {
      console.debug(`Stopping active stream on ${this.name}`);
      closeStreamTracks(this.activeStream);
      this.activeStream = undefined;
      this.streamCapabilities = undefined;
      this.torchEnabled = false;
    }
  }

  getVideoTrack() {
    if (!this.activeStream) {
      console.warn(`No active stream on Camera instance: ${this.name}.`);
      return;
    }

    return this.activeStream.getVideoTracks()[0];
  }
}
