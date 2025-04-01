export { default as TaskGroup } from "./TaskGroup.vue";
export { default as TaskGroupImage } from "./TaskGroupImage.vue";
export { default as TaskGroupLabel } from "./TaskGroupLabel.vue";
export { default as TaskGroupAccordion } from "./TaskGroupAccordion.vue";
export { default as TaskGroupAccordionTrigger } from "./TaskGroupAccordionTrigger.vue";

export interface TaskGroupLabelProps {
  label?: string;
}

export interface TaskGroupImageProps {
  image?: string;
}

export interface TaskGroupAccordionProps<T> {
  items: T;
}
