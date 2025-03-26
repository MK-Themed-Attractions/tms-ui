import type { InjectionKey, MaybeRefOrGetter, Ref } from "vue";

export { default as InfiniteScroll } from "./InfiniteScroll.vue";
export { default as InfiniteScrollTrigger } from "./InfiniteScrollTrigger.vue";
export { default as InfiniteScrollNoContent } from "./InfiniteScrollNoContent.vue";

export const triggerFunctionKey = Symbol() as InjectionKey<
  (cb: (canAddMore: boolean) => void) => void
>;
