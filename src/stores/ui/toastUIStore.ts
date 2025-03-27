import { defineStore } from "pinia";
import { ref } from "vue";
import { toast } from "vue-sonner";

/**
 * store that use Sonner (toast)
 * for setting and deleting toast globally
 */
export const useToastUIStore = defineStore("toastUi", () => {
  const toastIds = ref<(string | number)[]>([]);

  function setToast(toastId: string | number) {
    toastIds.value.push(toastId);
  }

  function dismissLastAddedToast() {
    if (!toastIds.value.length) {
      console.warn("no toast has been added");
      return;
    }

    toastIds.value.forEach((toastId) => {
      toast.dismiss(toastId);
    });
  }

  return {
    setToast,
    dismissLastAddedToast,
    toastIds,
  };
});
