import type { AxiosResponseError } from "@/types/axios";
import Axios, {
  type AxiosRequestConfig,
  type CreateAxiosDefaults,
} from "axios";
import { ref } from "vue";

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
  const errors = ref<AxiosResponseError | null>(null);
  const loading = ref(false);

  async function get(url: string, config: AxiosRequestConfig) {
    try {
      loading.value = true;
      const res = await axios.get(url, config);

      errors.value = null;
      return res;
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

  return {
    get,
    post,
    loading,
    errors,
  };
};
