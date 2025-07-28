export class HttpResponse<T> {
  success: boolean;
  message: string | string[];
  data?: T;

  constructor(success: boolean, message: string | string[], data?: T) {
    this.success = success;
    this.message = message;
    this.data = data;
  }
}
