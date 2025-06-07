import { FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import { randomUUID } from 'crypto';

export default fp(async (fastify) => {
  fastify.addHook('onRequest', async (request: FastifyRequest) => {
    const traceId = randomUUID();
    request.id = traceId;
    request.log = fastify.log.child({
      reqId: traceId,
    });
    request.log.info({
      ...request,
      hostname: request.hostname,
      host: request.host,
      originalUrl: request.originalUrl,
      from: request.headers.from,
    });
  });

  fastify.addHook('onSend', async (request: FastifyRequest, reply: FastifyReply) => {
    reply.header('x-go-trace-id', request.id);
    request.log.info({
      where: 'onSend request log',
      elapse: reply.elapsedTime,
      statusCode: reply.statusCode,
    });
    reply.log.info({
      where: 'onSend reply log',
      elapse: reply.elapsedTime,
      statusCode: reply.statusCode,
    });
  });

  fastify.addHook('onResponse', async (request: FastifyRequest, reply: FastifyReply) => {
    request.log.info({
      where: 'onResponse request log',
      elapse: reply.elapsedTime,
      statusCode: reply.statusCode,
    });
    reply.log.info({
      where: 'onResponse reply log',
      elapse: reply.elapsedTime,
      statusCode: reply.statusCode,
    });
  });
});
