/**
 * Use this composable if you want to
 * implement multiple selection in Data Table
 * that mimics Vuetify's Data Table selection behavior.
 */
import { computed, ref, watch, type Ref } from "vue";

export function useDataTableChecks<T extends { id: string }>(itemsRef: Ref<T[]>) {
  // Persist checked items across pages
  const checkedItems: Ref<T[]> = ref([]);

  // Keeps track of current page items
  const currentItems: Ref<T[]> = ref([]);

  // Sync currentItems with itemsRef
  watch(
    itemsRef,
    (newValue) => {
      // Update currentItems whenever itemsRef changes
      currentItems.value = newValue;
    },
    { immediate: true }
  );

  // Add or remove item from checkedItems
  function toggleCheck(item: T) {
    if (isChecked(item)) {
      checkedItems.value = checkedItems.value.filter((i) => i.id !== item.id);
    } else {
      checkedItems.value.push(item);
    }
  }

  // Check if item is in checkedItems
  function isChecked(item: T) {
    return checkedItems.value.some((i) => i.id === item.id);
  }

  /**
   * Function for the update event of the header-level checkbox.
   * It toggles selection for the current page only.
   */
  function handleCheckAll(isChecked: boolean) {
    if (isChecked) {
      // Add all current page items that are not already checked
      const newChecked = currentItems.value.filter(
        (item) => !checkedItems.value.some((i) => i.id === item.id)
      );
      checkedItems.value.push(...newChecked);
    } else {
      // Remove all current page items from checkedItems
      checkedItems.value = checkedItems.value.filter(
        (i) => !currentItems.value.some((item) => item.id === i.id)
      );
    }
  }

  /**
   * Indicator for the header-level checkbox.
   * It shows:
   * - `true` if all items on the current page are checked.
   * - `"indeterminate"` if some but not all items are checked.
   * - `false` if no items on the current page are checked.
   */
  const indicator = computed(() => {
    const currentChecked = currentItems.value.filter((item) =>
      checkedItems.value.some((i) => i.id === item.id)
    );

    if (currentChecked.length === 0) {
      return false;
    } else if (currentChecked.length < currentItems.value.length) {
      return "indeterminate";
    } else {
      return true;
    }
  });

  return {
    checkedItems,
    toggleCheck,
    isChecked,
    handleCheckAll,
    indicator,
  };
}
