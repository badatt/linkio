import awsLambdaFastify from '@fastify/aws-lambda';
import Fastify, { FastifyInstance } from 'fastify';

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
          statusCode: res.statusCode,
          status: res.status,
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
  },
});

fastify.register(app, options);

const proxy = awsLambdaFastify(fastify);

export const handler = proxy;
