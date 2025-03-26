export interface Notification<T = unknown> {
  data: {
    data?: T;
    message: string;
    status: boolean;
    type: NotificationType;
    user_id: string;
  };
}

export type NotificationType = "task create" | "batch create" | "plan create" | "plan delete";
