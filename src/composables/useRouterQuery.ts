import { computed, watch, type ComputedRef } from "vue";
import { useRoute, useRouter, type LocationQueryValue } from "vue-router";

export function useRouterQuery(
  queryName: string,
  callback?: (newValue: string) => void,
  excludeOtherQuery = false,
): [
  ComputedRef<LocationQueryValue | LocationQueryValue[]>,
  (value: string) => void,
] {
  const route = useRoute();
  const router = useRouter();

  const query = computed(() => route.query[queryName]);

  function setQuery(value: string) {
    if (excludeOtherQuery) {
      router.push({ query: { [queryName]: value } });
    } else
      router.push({
        query: {
          ...route.query,
          [queryName]: value,
        },
      });
  }

  watch(query, (newValue) => {
    if (callback) callback(newValue as string);
  });

  return [query, setQuery];
}
