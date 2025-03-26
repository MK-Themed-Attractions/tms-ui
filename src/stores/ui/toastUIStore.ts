import { defineStore } from "pinia";
import { ref } from "vue";
import { toast } from "vue-sonner";

/**
 * store that use Sonner (toast)
 * for setting and deleting toast globally
 */
export const useToastUIStore = defineStore("toastUi", () => {
  const lastAddedToastId = ref<string | number>();

  function setToast(toastId: string | number) {
    lastAddedToastId.value = toastId;
  }

  function dismissLastAddedToast() {
    if (!lastAddedToastId.value) {
      console.warn("no toast has been added");
      return;
    }

    toast.dismiss(lastAddedToastId.value);
  }

  return {
    setToast,
    dismissLastAddedToast,
    lastAddedToastId,
  };
});
