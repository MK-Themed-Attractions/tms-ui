import { z } from "zod";
import type { QueryParams, TimeStamp } from "./general";
import type { InferInput } from "vee-validate";
import type { TicketType } from "./TicketType";

export type Ticket = TimeStamp & {
  id: string;
  title: string;
  details: string;
  status: TicketStatus;
  ticket_type_id: string;
  ticket_type?: TicketType;
  user_id: string;
};
export type TicketStatus = "pending" | "rejected" | "approved";

export const ticketSchema = z.object({
  title: z.string().nonempty("Required"),
  details: z.string().optional(),
  ticket_type_id: z.string().nonempty("Required"),
  user_id: z.string().optional(),
});

export type TicketSchema = z.infer<typeof ticketSchema>;

export type CreateTicketPayload = z.infer<typeof ticketSchema>;

export type UpdateTicketPayload = Partial<CreateTicketPayload>;

export type GetTicketsQueryParams = QueryParams & {
  type: string[];
  status: TicketStatus[];
  user_ids: string[]
};
