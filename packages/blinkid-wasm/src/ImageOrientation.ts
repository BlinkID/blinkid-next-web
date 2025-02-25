/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

/**
 * Specifies the orientation of the contents of the image.
 * This is important for some recognizers, especially when
 * performing recognition on the mobile device.
 *
 * TODO: rename this interface as it's present in lib.dom.d.ts
 */

export enum ImageOrientation {
  /**
   * Image contents are rotated 90 degrees left.
   * This usually happens on mobile devices when capturing image while
   * device is held in "portrait" orientation, while device camera sensor
   * is mounted horizontally (i.e. produced image is in "landscape" orienation).
   */
  RotatedLeft90,

  /**
   * Image contents are not rotated in any manner.
   * This is the default for images captured using HTML canvas, as
   * used in FrameCapture class.
   * This orientation also usually happens on mobile devices when capturing
   * image while device is held in "landscape" orientation, while device
   * camera sensor is mounted horizontally (i.e. also in same orientation).
   */
  NoRotation,

  /**
   * Image contents are rotated 90 degrees right.
   * This usually happens on mobile devices when capturing image while
   * device is held in "reverse-portrait" orientation, while device camera sensor
   * is mounted horizontally (i.e. produced image is in "landscape" orienation).
   */
  RotatedRight90,

  /**
   * Image contents are rotated 180 degrees, i.e. image contents are "upside down".
   * This usually happens on mobile devices when capturing image while
   * device is held in "reverse-landscape" orientation, while device camera sensor
   * is mounted horizontally (i.e. produced image is in "landscape" orienation).
   */
  Rotated180,
}
