/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

export const getFPSFromConstraints = (
  constraints: MediaStreamConstraints,
): number => {
  if (typeof constraints.video === "object" && constraints.video.frameRate) {
    return typeof constraints.video.frameRate === "number"
      ? constraints.video.frameRate
      : (constraints.video.frameRate.ideal ?? 30);
  }
  return 30;
};
