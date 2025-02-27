/**
 * Copyright (c) 2025 Microblink Ltd. All rights reserved.
 */

import { ParentComponent, createContext, onMount, useContext } from "solid-js";
import { SetStoreFunction, createStore } from "solid-js/store";

import enLocaleStrings from "./locales/en";

export type LocaleRecord = typeof enLocaleStrings;

export type LocalizationStrings = {
  // This allows for autocomplete for defaults, but also overriding
  // https://twitter.com/mattpocockuk/status/1709281782325977101
  // eslint-disable-next-line @typescript-eslint/ban-types
  [K in keyof LocaleRecord]: LocaleRecord[K] | (string & {});
};

const LocalizationContext = createContext<{
  t: LocalizationStrings;
  updateLocalization: SetStoreFunction<LocalizationStrings>;
}>();

export const LocalizationProvider: ParentComponent<{
  userStrings?: Partial<LocalizationStrings>;
  /**  A hacky way to lift the `updateLocalizationStore` function out of the Context */
  setLocalizationRef: (fn: SetStoreFunction<LocalizationStrings>) => void;
}> = (props) => {
  const [localizationStore, updateLocalizationStore] =
    createStore<LocalizationStrings>(
      // we structure clone to avoid proxying to the original object
      structuredClone({
        ...enLocaleStrings,
        // we don't care on init
        // eslint-disable-next-line solid/reactivity
        ...props.userStrings,
      }),
    );

  onMount(() => {
    props.setLocalizationRef(updateLocalizationStore);
  });

  const contextValue = {
    t: localizationStore,
    updateLocalization: updateLocalizationStore,
  };

  return (
    <LocalizationContext.Provider value={contextValue}>
      {props.children}
    </LocalizationContext.Provider>
  );
};

export function useLocalization() {
  const ctx = useContext(LocalizationContext);
  if (!ctx) {
    throw new Error("LocalizationContext.Provider not in scope.");
  }
  return ctx;
}
