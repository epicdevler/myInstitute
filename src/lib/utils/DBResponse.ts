export interface DBResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}
