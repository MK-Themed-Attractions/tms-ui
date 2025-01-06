import type { Component, PropType } from "vue";
export { default as ButtonApp } from "./ButtonApp.vue";

export interface ButtonProps {
  prependIcon?: Component;
  appendIcon?: Component;
  loading?: boolean;
}
