import type { QueryParams, TimeStamp } from "./general";

export type Notification<T = any> = TimeStamp & {
  data: {
    data?: T;
    message: string;
    status: boolean;
    type: NotificationType;
    user_id: string;
  };
  type: NotificationType;
  user_id: string;
  id: string;
};

export type NotificationType =
  | "task create"
  | "batch create"
  | "plan create"
  | "plan delete";

export type GetNotificationsQueryParams = Partial<
  QueryParams & {
    type: NotificationType;
    user_id: string[];
  }
>;
