export * from './link';
export * from './user';

export interface FastifyErrorResponse {
  statusCode?: number;
  code?: string;
  error?: string;
  message?: string;
}
