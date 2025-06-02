export class ApiError  extends Error {
  statusCode: number;
  code?: string;

  constructor(statusCode: number, message: string, code?: string) {
    super(message);
    this.code = code ?? 'ApiError';
    this.name = this.code;
    this.message = message;
    this.statusCode = statusCode;
    Error.captureStackTrace?.(this, this.constructor);
  }
}
