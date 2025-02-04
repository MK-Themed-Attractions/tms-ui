export interface Notification<T = unknown> {
  data: {
    data: {
      payload?: T;
      title: string;
    };
    message: string;
    status: boolean;
    type: NotificationType;
    user_id: string;
  };
}

export type NotificationType = "Task Create";
