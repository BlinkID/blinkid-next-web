/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

export const imageDataToUrl = (imageData: ImageData) => {
  const canvas = document.createElement("canvas");
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("missing canvas");
  }

  ctx.putImageData(imageData, 0, 0);

  const dataUrl = canvas.toDataURL();

  return dataUrl;
};

export const getBase64StringFromDataURL = (dataURL: string) =>
  dataURL.replace("data:", "").replace(/^.+,/, "");
