/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import { createBlinkIdUi } from "@microblink/blinkid-next";

const blinkId = await createBlinkIdUi({
  licenseKey: import.meta.env.VITE_LICENCE_KEY,
});

blinkId.addOnErrorCallback((result) => {
  console.log(result);
  void blinkId.destroy();
});
