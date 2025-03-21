export { default as Loader } from "./Loader.vue";
export { default as LoaderDescription } from "./LoaderDescription.vue";

import type { Component, ComputedRef, InjectionKey } from "vue";

export type LoaderProps = Partial<{
  icon: Component;
  description: string;
}>;

export const loaderDescriptionKey = Symbol() as InjectionKey<
  ComputedRef<string | undefined>
>;
