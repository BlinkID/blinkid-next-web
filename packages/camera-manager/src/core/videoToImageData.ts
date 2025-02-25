/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

let canvas: HTMLCanvasElement;

export function videoToImageData(video: HTMLVideoElement, mirrorX = false) {
  if (!canvas) {
    canvas = document.createElement("canvas");
  }

  const ctx = canvas.getContext("2d", {
    willReadFrequently: true,
    alpha: false,
  });

  if (!ctx) {
    throw new Error("CanvasRenderingContext2D is missing!");
  }

  const w = video.videoWidth;
  const h = video.videoHeight;

  canvas.width = w;
  canvas.height = h;

  ctx.drawImage(video, 0, 0, w, h);

  if (mirrorX) {
    ctx.scale(-1, 1);
  }

  const imageData = ctx.getImageData(0, 0, w, h);

  return imageData;
}
