import awsLambdaFastify from '@fastify/aws-lambda';
import Fastify, { FastifyInstance } from 'fastify';
import pino from 'pino';

import { app, options } from './app.js';

const logger = pino(
  {
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
  pino.destination(1),
);

const fastify: FastifyInstance = Fastify({ logger });
fastify.register(app, options);

const proxy = awsLambdaFastify(fastify);

export const handler = proxy;
