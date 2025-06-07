import awsLambdaFastify from '@fastify/aws-lambda';
import Fastify, { FastifyInstance } from 'fastify';
import { randomUUID } from 'crypto';

import { app, options } from './app.js';

const fastify: FastifyInstance = Fastify({
  logger: {
    level: 'info',
    messageKey: 'msg',
    formatters: {
      level(label) {
        return { level: label };
      },
      bindings() {
        return {};
      },
      log(object) {
        return {
          traceId: object.reqId ?? object.traceId,
          message: object.msg,
          ...object,
        };
      },
    },
    timestamp: false,
    serializers: {
      req(req) {
        return {
          traceId: req.id,
          method: req.method,
          url: req.url,
        };
      },
      res(res) {
        return {
          traceId: res.getHeader?.('x-go-trace-id'),
          statusCode: res.statusCode,
          elapsed: res.elapsedTime,
        };
      },
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
    genReqId: () => randomUUID(),
  },
});

fastify.register(app, options);

const proxy = awsLambdaFastify(fastify);

export const handler = proxy;
