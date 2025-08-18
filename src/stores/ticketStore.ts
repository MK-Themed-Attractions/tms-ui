import { useAxios } from "@/composables/useAxios";
import { useStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { useAuthStore } from "./authStore";
import type {
  CreateTicketPayload,
  GetTicketsQueryParams,
  Ticket,
  TicketStatus,
  UpdateTicketPayload,
} from "@/types/ticket";
import type {
  CreateTicketTypePayload,
  TicketType,
  UpdateTicketTypePayload,
} from "@/types/TicketType";
import type { SimplePaginate } from "@/types/pagination";
import { computed, ref } from "vue";

export const useTicketStore = defineStore("tickets", () => {
  const baseUrl = import.meta.env.VITE_TICKET;
  const bearerToken = useStorage(
    import.meta.env.VITE_TICKET_BEARER_TOKEN_KEY,
    "",
  );
  const { get, errors, loading, setHeader, post, patch, put, destroy } =
    useAxios({
      baseURL: baseUrl,
    });
  setHeader("Bearer-Token", bearerToken);

  const authStore = useAuthStore();

  const ticketsRaw = ref<SimplePaginate<Ticket>>();
  const ticketTypesRaw = ref<SimplePaginate<TicketType>>();

  /* GETTERS */
  const tickets = computed(() => ticketsRaw.value?.data);
  const ticketTypes = computed(() => ticketTypesRaw.value?.data);

  function invalidate() {
    bearerToken.value = null;
    ticketsRaw.value = undefined;
  }

  async function getTickets(params?: Partial<GetTicketsQueryParams>) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );

    const res = await get<{ data: SimplePaginate<Ticket> }>("/api/tickets", {
      params,
    });

    if (res) {
      return res;
    }
  }
  async function getTicket(ticketId: string) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );

    const res = await get<{ data: Ticket }>(`/api/tickets/${ticketId}`);

    if (res) {
      return res.data;
    }
  }

  async function createTicket(payload: CreateTicketPayload) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );
    const res = await post("/api/tickets", payload);

    return res;
  }
  async function updateTicket(ticketId: string, payload: UpdateTicketPayload) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );
    const res = await put(`/api/tickets/${ticketId}`, payload);

    return res;
  }

  async function changeTicketStatus(ticketId: string, status: TicketStatus) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );
    await patch(`/api/tickets/${ticketId}`, { status: status });
  }
  async function deleteTicket(ticketId: string) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );

    await destroy(`/api/tickets/${ticketId}`);
  }

  async function getTicketTypes() {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );

    const res = await get<{ data: SimplePaginate<TicketType> }>(
      "/api/ticket-type",
      {
        params: { per_page: 999999999 },
      },
    );
    ticketTypesRaw.value = res?.data;

    return res?.data;
  }

  async function getTicketType(ticketTypeId: string) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );

    const res = await get<TicketType>(`/api/ticket-type/${ticketTypeId}`);
    return res;
  }

  async function createTicketType(payload: CreateTicketTypePayload) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );

    const res = await post("/api/ticket-type", payload);
  }
  async function updateTicketType(
    ticketTypeId: string,
    payload: UpdateTicketTypePayload,
  ) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );

    const res = await put(`/api/ticket-type/${ticketTypeId}`, payload);
  }

  async function deleteTicketType(ticketTypeId: string) {
    await authStore.checkTokenValidity(
      `${baseUrl}/api/auth/bearer-token`,
      bearerToken,
    );

    await destroy(`/api/ticket-type/${ticketTypeId}`);
  }

  return {
    getTickets,
    invalidate,
    loading,
    errors,
    tickets,
    getTicketTypes,
    getTicketType,
    getTicket,
    ticketTypes,
    createTicket,
    updateTicket,
    changeTicketStatus,
    deleteTicket,
    createTicketType,
    updateTicketType,
    deleteTicketType
  };
});
