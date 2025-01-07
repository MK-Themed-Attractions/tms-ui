/* Use this composable when you want  your vue-router query parameters to be reactive */

import { ref, watch, type Ref } from "vue";
import { useRoute, useRouter } from "vue-router";

export const useRouteParams = (
  _param: string,
): [
  Ref<string | null>,
  (name: string, newParam: string, replace?: boolean) => void,
] => {
  const route = useRoute();
  const router = useRouter();
  const param = ref<string | null>(
    route.params[_param] ? route.params[_param].toString() : null,
  );

  watch(
    () => route.params[_param],
    (newVal) => {
      param.value = newVal ? newVal.toString() : null;
    },
  );

  function setParam(name: string, newParam: string, replace?: boolean) {
    router.push({ name, params: { [_param]: newParam }, replace });
  }
  return [param, setParam];
};
