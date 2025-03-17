export { default as EmptyResource } from "./EmptyResource.vue";
export { default as EmptyResourceTitle } from "./EmptyResourceTitle.vue";
export { default as EmptyResourceDescription } from "./EmptyResourceDescription.vue";
export { default as EmptyResourceIcon } from "./EmptyResourceIcon.vue";

import type { Component, ComputedRef, InjectionKey } from "vue";

export interface EmptyResourceProps {
  title?: string;
  description?: string;
  icon?: Component;
}

export const emptyResourceTitleKey = Symbol() as InjectionKey<
  ComputedRef<string | undefined>
>;
export const emptyResourceIconKey = Symbol() as InjectionKey<
  ComputedRef<Component | undefined>
>;
export const emptyResourceDescriptionKey = Symbol() as InjectionKey<
  ComputedRef<string | undefined>
>;
