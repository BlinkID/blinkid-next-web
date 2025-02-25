/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import { expect, test, describe, beforeAll } from "vitest";
import { mediaMocker } from "../media-mock/MediaMocker";
import {
  createCameras,
  findIdealCamera,
  getCameraDevices,
} from "../core/cameraUtils";

describe("Camera picking on iPhone", () => {
  beforeAll(() => {
    mediaMocker.configure({ device: "iPhone 15" });
    mediaMocker.mock();

    return () => mediaMocker.unmock();
  });

  test("iPhone 15 selects Back Dual Wide Camera by default ", async () => {
    const cameraInfos = await getCameraDevices();
    const cameraInstances = createCameras(cameraInfos);

    expect((await findIdealCamera(cameraInstances)).name).toBe(
      "Back Dual Wide Camera",
    );

    mediaMocker.reverseCameraOrder();

    expect((await findIdealCamera(cameraInstances)).name).toBe(
      "Back Dual Wide Camera",
    );
  });

  test("iPhone 15 selects Back Dual Wide Camera when requesting back facing ", async () => {
    const cameraInfos = await getCameraDevices();
    const cameraInstances = createCameras(cameraInfos);

    expect((await findIdealCamera(cameraInstances, "FHD", "back")).name).toBe(
      "Back Dual Wide Camera",
    );

    mediaMocker.reverseCameraOrder();

    expect((await findIdealCamera(cameraInstances, "FHD", "back")).name).toBe(
      "Back Dual Wide Camera",
    );
  });

  test("iPhone 15 selects Front Camera when requesting front facing ", async () => {
    const cameraInfos = await getCameraDevices();
    const cameraInstances = createCameras(cameraInfos);

    expect((await findIdealCamera(cameraInstances, "FHD", "front")).name).toBe(
      "Front Camera",
    );

    mediaMocker.reverseCameraOrder();

    expect((await findIdealCamera(cameraInstances, "FHD", "front")).name).toBe(
      "Front Camera",
    );
  });
});

describe("Camera picking on Samsung S21FE", () => {
  beforeAll(() => {
    mediaMocker.configure({ device: "Samsung S21FE" });
    mediaMocker.mock();

    return () => mediaMocker.unmock();
  });
  test("Samsung S21FE selects camera2 0, facing back by default ", async () => {
    const cameraInfos = await getCameraDevices();
    const cameraInstances = createCameras(cameraInfos);

    expect((await findIdealCamera(cameraInstances)).name).toBe(
      "camera2 0, facing back",
    );

    mediaMocker.reverseCameraOrder();

    expect((await findIdealCamera(cameraInstances)).name).toBe(
      "camera2 0, facing back",
    );
  });

  test("Samsung S21FE selects camera2 0, facing back when requesting back facing ", async () => {
    const cameraInfos = await getCameraDevices();
    const cameraInstances = createCameras(cameraInfos);

    expect((await findIdealCamera(cameraInstances, "FHD", "back")).name).toBe(
      "camera2 0, facing back",
    );

    mediaMocker.reverseCameraOrder();

    expect((await findIdealCamera(cameraInstances, "FHD", "back")).name).toBe(
      "camera2 0, facing back",
    );
  });

  test("Samsung S21FE selects camera2 3, facing front when requesting front facing ", async () => {
    const cameraInfos = await getCameraDevices();
    const cameraInstances = createCameras(cameraInfos);

    expect((await findIdealCamera(cameraInstances, "FHD", "front")).name).toBe(
      "camera2 3, facing front",
    );

    mediaMocker.reverseCameraOrder();

    expect((await findIdealCamera(cameraInstances, "FHD", "front")).name).toBe(
      "camera2 3, facing front",
    );
  });
});
