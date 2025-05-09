import { useAxios } from "@/composables/useAxios";
import type {
  InventoryAllocatedBom,
  InventoryPayload,
  InventoryQueryParams,
} from "@/types/inventory";
import { useStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { useAuthStore } from "./authStore";

export const useInventoryStore = defineStore("inventories", () => {
  const baseUrl = import.meta.env.VITE_INVENTORY;
  const bearerToken = useStorage(
    import.meta.env.VITE_INVENTORY_BEARER_TOKEN_KEY,
    "",
  );
  const { get, errors, loading, setHeader, post, put, destroy } = useAxios({
    baseURL: baseUrl,
  });
  setHeader("Bearer-Token", bearerToken);
  const authStore = useAuthStore();

  /* GETTERS */

  function invalidate() {
    bearerToken.value = null;
  }

  async function validateToken() {
    try {
      await authStore.checkTokenValidity(
        `${baseUrl}/api/auth/bearer-token`,
        bearerToken,
      );
    } catch (error) {
      console.log(error);
    }
  }
  async function addInventoryConsumption(payload: InventoryPayload) {
    try {
      await post("/api/consumption/mass-store", payload);
    } catch (error) {
      console.log(error);
    }
  }
  async function updateInventoryConsumption(payload: InventoryPayload) {
    try {
      await put("/api/consumption/mass-update", payload);
    } catch (error) {
      console.log(error);
    }
  }

  async function getInventoryConsumptionByPlanTaskId(
    params: InventoryQueryParams,
  ) {
    try {
      const res = await get<{ data: InventoryAllocatedBom[] }>(
        "/api/consumption/get-consumpion-by-plan-task-id",
        {
          params,
        },
      );

      if (res) {
        return res.data;
      }
    } catch (error) {
      console.log(error);
    }
  }

  return {
    invalidate,
    errors,
    loading,
    validateToken,
    addInventoryConsumption,
    getInventoryConsumptionByPlanTaskId,
    updateInventoryConsumption
  };
});
