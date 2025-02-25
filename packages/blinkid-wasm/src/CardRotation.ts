/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

/**
 * CardRotation enum defines possible states of card rotation.
 */

export enum CardRotation {
  /** Card is in its original position */
  None,

  /** Card is rotated 90 degrees to the right */
  Clockwise90,

  /** Card is rotated 90 degrees to the left */
  CounterClockwise90,

  /** Card is flipped upside down */
  UpsideDown,
}
