/**
 * Use this composable if you want to
 * implement multiple selection in Data Table
 */

import { computed, ref, type Ref } from "vue";

export function useDataTableChecks<T extends { id: string }>(items: T[]) {
  /* selected items or list of checked items */
  const checkedItems: Ref<T[]> = ref([]);

  function add(item: T) {
    if (itemExists(item)) {
      checkedItems.value = checkedItems.value.filter((i) => i.id !== item.id);
    } else checkedItems.value.push(item);
  }

  function itemExists(item: T) {
    return checkedItems.value.some((i) => i.id === item.id);
  }

  /**
   * Function for the update event of parent checkbox.
   * bind this to the @update:checked props of the parent checkbox
   */
  function handleCheck(e: boolean) {
    if (e) {
      checkedItems.value = items;
    } else {
      checkedItems.value = [];
    }
  }

  /**
   * Indicator for the parent checkbox.
   * Bind this to the :checked props of the parent checkbox
   */
  const indicator = computed(() => {
    if (!checkedItems.value.length) {
      return false;
    } else if (checkedItems.value.length < items.length) {
      return "indeterminate";
    } else return true;
  });

  return {
    checkedItems,
    add,
    itemExists,
    handleCheck,
    indicator,
  };
}
