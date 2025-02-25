/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import { createBlinkIdCore } from "@microblink/blinkid-core";

const blinkIdCore = await createBlinkIdCore({
  licenseKey: import.meta.env.VITE_LICENCE_KEY,
  scanningMode: "singleSide",
});

const frameResult = await blinkIdCore.processImage(new ImageData(1920, 1080));
console.log("frameResult", frameResult);

const result = await blinkIdCore.getResult();
console.log("result", result);
