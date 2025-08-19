import { z } from "zod";
import type { QueryParams, TimeStamp } from "./general";

export type TicketType = TimeStamp & {
  name: string;
  description?: string;
  id: string;
};

export const ticketTypeSchema = z.object({
  name: z.string().nonempty("Required"),
  description: z.string().optional(),
});

export type TicketTypeSchema = z.infer<typeof ticketTypeSchema>;

export type CreateTicketTypePayload = TicketTypeSchema;
export type UpdateTicketTypePayload = Partial<CreateTicketTypePayload>;

export type GetTicketTypeQueryParams = QueryParams;
