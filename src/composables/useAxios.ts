import type { AxiosResponseError } from "@/types/axios";
import Axios, {
  type AxiosRequestConfig,
  type CreateAxiosDefaults,
} from "axios";
import { ref, watchEffect, type MaybeRefOrGetter } from "vue";
import { useAxiosErrorRedirects } from "./useAxiosErrorRedirects";

/* global error instance */
const errors = ref<AxiosResponseError | null>(null);

export const useAxios = (config: CreateAxiosDefaults) => {
  const axios = Axios.create({
    headers: {
      "Content-Type": "application/json",
    },
    ...config,
  });

  /* standardized the axios response error */
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      return Promise.reject({
        status: error.status,
        data: error.response.data,
      });
    },
  );

  const loading = ref(false);
  const { redirectToLoginPage } = useAxiosErrorRedirects();

  /* ERROR REDIRECTS */
  watchEffect(async () => {
    switch (errors.value?.status) {
      /* unauthorize response */
      case 401: {
        clearAuth();
        await redirectToLoginPage();
      }
    }
  });

  /**
   * Clear user storage including access, refresh and bearer-tokens
   */
  function clearAuth() {
    localStorage.clear();
  }

  /**
   * use to set the axios header
   * to be reactive base on ref value passed as parameter
   * @param headerKey name of the header
   * @param ref the reactive value to be watched for changes
   */
  function setHeader(headerKey: string, ref: MaybeRefOrGetter) {
    console.log(ref.value);
    watchEffect(() => {
      axios.defaults.headers[headerKey] = ref.value;
    });
  }

  /* API CALLS */
  async function get<T>(url: string, config?: AxiosRequestConfig) {
    try {
      loading.value = true;
      const res = await axios.get(url, config);

      errors.value = null;
      return res.data as T;
    } catch (err) {
      errors.value = err as AxiosResponseError;
    } finally {
      loading.value = false;
    }
  }
  async function post<T, U>(
    url: string,
    payload?: T,
    config?: AxiosRequestConfig,
  ) {
    try {
      if (errors.value) return;

      loading.value = true;
      const res = await axios.post(url, payload, config);

      errors.value = null;

      return res.data as U;
    } catch (err) {
      errors.value = err as AxiosResponseError;
    } finally {
      loading.value = false;
    }
  }
  async function put<T, U>(
    url: string,
    payload?: T,
    config?: AxiosRequestConfig,
  ) {
    try {
      if (errors.value) return;

      loading.value = true;
      const res = await axios.put(url, payload, config);

      errors.value = null;

      return res.data as U;
    } catch (err) {
      errors.value = err as AxiosResponseError;
    } finally {
      loading.value = false;
    }
  }

  return {
    get,
    post,
    loading,
    errors,
    put,
    setHeader,
  };
};
