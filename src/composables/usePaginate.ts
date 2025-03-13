import type {
  SimplePaginate,
  SimplePaginateAPIResource,
} from "@/types/pagination";
import { computed, ref } from "vue";

export function useSimplePaginate<T>() {
  const paginate = ref<SimplePaginate<T>>();

  const items = computed(() => paginate.value?.data);
  const hasNextPage = computed(() => paginate.value?.next_page_url);
  const hasPrevPage = computed(() => paginate.value?.prev_page_url);

  return {
    paginate,
    items,
    hasNextPage,
    hasPrevPage,
  };
}

export function useSimplePaginateAPIResource<T>() {
  const paginate = ref<SimplePaginateAPIResource<T>>();

  const items = computed(() => paginate.value?.data);
  const hasNextPage = computed(() => paginate.value?.links.next);
  const hasPrevPage = computed(() => paginate.value?.links.prev);

  return {
    paginate,
    items,
    hasNextPage,
    hasPrevPage,
  };
}
