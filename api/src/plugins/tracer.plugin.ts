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
      url: request.url,
      originalUrl: request.originalUrl,
      method: request.method,
      params: request.params,
      raw: {
        httpVersion: request.raw.httpVersion,
        hostname: request.hostname,
        host: request.host,
        ip: request.ip,
        userAgent: request.headers['user-agent'],
        xAmznTraceID: request.headers['x-amzn-trace-id'],
        xForwardedFor: request.headers.forwarded,
        contentType: request.headers['content-type']
      },
    });
  });

  fastify.addHook('onSend', async (request: FastifyRequest, reply: FastifyReply) => {
    reply.header('x-go-trace-id', request.id);
  });

  fastify.addHook('onResponse', async (request: FastifyRequest, reply: FastifyReply) => {
    request.log.info({
      elapse: reply.elapsedTime,
      statusCode: reply.statusCode,
    });
  });
});
