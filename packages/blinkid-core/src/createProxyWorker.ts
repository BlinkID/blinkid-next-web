/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import type { BlinkIdWorkerProxy } from "../../blinkid-worker/types/BlinkIdWorker";
import { wrap } from "comlink";
import { getCrossOriginWorkerURL } from "./getCrossOriginWorkerURL";

/**
 * Creates a Comlink-proxied Web Worker
 *
 * @param resourcesLocation where the "resources" directory is placed, default
 * is `window.location.href`
 * @returns a Comlink-proxied instance of the Web Worker
 */
export const createProxyWorker = async (
  resourcesLocation: string = window.location.href,
) => {
  const workerUrl = await getCrossOriginWorkerURL(
    new URL("resources/blinkid-worker.js", resourcesLocation).toString(),
  );

  const worker = new Worker(workerUrl);

  worker.onerror = (e) => {
    console.error("Worker error:", e);
  };

  const proxyWorker = wrap<BlinkIdWorkerProxy>(worker);

  return proxyWorker;
};

export type RemoteWorker = ReturnType<typeof createProxyWorker>;
