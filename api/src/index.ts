import awsLambdaFastify from '@fastify/aws-lambda';
import Fastify, { FastifyInstance } from 'fastify';

import { app, options } from './app.js';

const fastify: FastifyInstance = Fastify({
  logger: {
    level: 'info',
    timestamp: false,
    formatters: {
      bindings() {
        return {};
      },
      level(label) {
        return { level: label };
      },
      log(obj) {
        return { msg: `[${obj.level}] ${obj.traceId} ${obj.msg}` };
      },
    },
    messageKey: 'msg',
  },
});

fastify.register(app, options);

const proxy = awsLambdaFastify(fastify);

export const handler = proxy;
