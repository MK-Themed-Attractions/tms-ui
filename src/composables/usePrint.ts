import { ref, type Ref } from "vue";

export function usePrint<T extends Ref<HTMLElement | null>>(
  element: T,
  callback?: () => void,
) {
  const cloneElement = ref<Node>();

  window.addEventListener("afterprint", cleanUp);

  function cleanUp() {
    if (!element.value || !cloneElement.value) return;

    document.body.removeChild(cloneElement.value);
    document.body.classList.remove("invisible");
    (<HTMLElement>cloneElement.value).classList.remove(
      "absolute",
      "top-0",
      "z-[99999]",
      "visible",
    );

    if (callback) {
      callback();
    }
  }
  function print() {
    if (!element.value) return;

    cloneElement.value = element.value.cloneNode(true);
    document.body.appendChild(cloneElement.value);
    document.body.classList.add("invisible");
    (<HTMLElement>cloneElement.value).classList.add(
      "absolute",
      "top-0",
      "z-[99999]",
      "visible",
    );

    window.print();
  }
  return {
    print,
  };
}
