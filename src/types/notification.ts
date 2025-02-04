export interface Notification<T = unknown> {
  data: {
    data?: T;
    message: string;
    status: boolean;
    type: NotificationType;
    user_id: string;
  };
}

export type NotificationType = "Task Create" | "Batch Create" | "Plan Create";
