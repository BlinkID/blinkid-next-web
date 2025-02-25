/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

/**
 * Specifies an abstract object placed on the WebAssembly heap.
 * Objects placed on the WebAssembly heap are not cleaned up by the
 * garbage collector of the JavaScript engine. The memory used by
 * the object must be cleaned up manually by calling the delete() method.
 *
 * {@link} https://emscripten.org/docs/porting/connecting_cpp_and_javascript/embind.html#memory-management
 */
export declare abstract class EmbindObject {
  /**
   * Cleans up the object from the WebAssembly heap.
   */
  delete(): Promise<void>;
}
