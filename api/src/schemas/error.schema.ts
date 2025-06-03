import { Type } from '@sinclair/typebox';

const ErrorBodySchema = Type.Object({
  code: Type.String(),
  name: Type.Optional(Type.String()),
  message: Type.String(),
  statusCode: Type.Optional(Type.Integer()),
  trace: Type.Optional(Type.String()),
});

const AllErrorSchemas = {
  400: ErrorBodySchema, // Bad Request
  401: ErrorBodySchema, // Unauthorized
  402: ErrorBodySchema, // Payment Required
  403: ErrorBodySchema, // Forbidden
  404: ErrorBodySchema, // Not Found
  405: ErrorBodySchema, // Method Not Allowed
  406: ErrorBodySchema, // Not Acceptable
  407: ErrorBodySchema, // Proxy Authentication Required
  408: ErrorBodySchema, // Request Timeout
  409: ErrorBodySchema, // Conflict
  410: ErrorBodySchema, // Gone
  411: ErrorBodySchema, // Length Required
  412: ErrorBodySchema, // Precondition Failed
  413: ErrorBodySchema, // Payload Too Large
  414: ErrorBodySchema, // URI Too Long
  415: ErrorBodySchema, // Unsupported Media Type
  416: ErrorBodySchema, // Range Not Satisfiable
  417: ErrorBodySchema, // Expectation Failed
  418: ErrorBodySchema, // I'm a teapot (RFC 7168)
  421: ErrorBodySchema, // Misdirected Request
  422: ErrorBodySchema, // Unprocessable Entity
  423: ErrorBodySchema, // Locked
  424: ErrorBodySchema, // Failed Dependency
  425: ErrorBodySchema, // Too Early
  426: ErrorBodySchema, // Upgrade Required
  428: ErrorBodySchema, // Precondition Required
  429: ErrorBodySchema, // Too Many Requests
  431: ErrorBodySchema, // Request Header Fields Too Large
  451: ErrorBodySchema, // Unavailable For Legal Reasons
  500: ErrorBodySchema, // Internal Server Error
  501: ErrorBodySchema, // Not Implemented
};

function errorSchemas(errorCodes: number[]): Record<number, unknown> {
  return {
    ...Object.fromEntries(errorCodes.map((code) => [code, ErrorBodySchema])),
  };
}

export { AllErrorSchemas, errorSchemas };
