export interface AxiosError {
  data?: any;
  message: string;
}

export interface AxiosResponseError {
  status: number;
  data: AxiosError;
}
