/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

/**
 * Detection status of the specific detected object.
 */

export enum DetectionStatus {
  /** Detection has failed. */
  Failed,
  /** Document has been detected. */
  Success,
  /** Document has been detected but the camera is too far from the document. */
  CameraTooFar,
  /** Document has been detected but the camera is too close to the document. */
  CameraTooClose,
  /** Document has been detected but the camera’s angle is too steep. */
  CameraAngleTooSteep,
  /** Document has been detected but the document is too close to the camera edge. */
  DocumentTooCloseToCameraEdge,
  /** Only part of the document is visible. */
  DocumentPartiallyVisible,
}
