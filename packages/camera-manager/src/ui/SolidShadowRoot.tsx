/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import { getOwner, JSX, ParentComponent, runWithOwner, Show } from "solid-js";
import { Portal, render } from "solid-js/web";

export const SolidShadowRoot: ParentComponent<{
  /** Disables shadow root, mostly useful for debugging */
  disableShadowRoot?: boolean;
  // TODO: better typing
  class?: string | undefined;
  style?: JSX.CSSProperties | string;
  getRef?: (el: HTMLDivElement) => void;
}> = (props) => {
  // we use getOwner in case of async rendering, for instance, it was used to
  // test rendering after a timeout
  const owner = getOwner();

  return (
    <div
      ref={(ref) => {
        if (props.disableShadowRoot) {
          return;
        }

        const shadowRoot = ref.attachShadow({ mode: "open" });

        runWithOwner(owner, () => {
          render(() => <>{props.children}</>, shadowRoot);
        });
      }}
      class={props.class}
      style={props.style}
    >
      <Show when={props.disableShadowRoot}>{props.children}</Show>
    </div>
  );
};

/**
 * A declarative shadow root component
 *
 * Hooks into SolidJS' Portal's `useShadow` prop
 * to handle shadow DOM and the component lifecycle
 *
 * @deprecated
 */
export const SolidShadowRootWithPortal: ParentComponent = (props) => {
  let shadowTarget: HTMLDivElement;
  return (
    <div ref={shadowTarget!}>
      <Portal mount={shadowTarget!} useShadow={true}>
        {props.children}
      </Portal>
    </div>
  );
};
