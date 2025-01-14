export { default as ConfirmationDialog } from "./ConfirmationDialog.vue";

export interface DialogProps {
  title: string;
  description: string;
  yesMessage: string;
  noMessage: string;
}
