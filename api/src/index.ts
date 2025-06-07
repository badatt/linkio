import awsLambdaFastify from '@fastify/aws-lambda';
import Fastify, { FastifyInstance } from 'fastify';

import { app, options } from './app.js';

const fastify: FastifyInstance = Fastify({
  logger: {
    level: 'info',
    formatters: {
      level(label) {
        return { level: label };
      },
      bindings() {
        return {};
      },
    },
    timestamp: false,
    serializers: {
      err(err) {
        return {
          statusCode: err.statusCode,
          message: err.message,
          type: err.code,
          stack: err.stack ?? '',
        };
      },
    },
    redact: ['req.headers.authorization'],
  },
  disableRequestLogging: true,
});

fastify.register(app, options);

const proxy = awsLambdaFastify(fastify);

export const handler = proxy;
