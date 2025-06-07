import { FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import { randomUUID } from 'crypto';

export default fp(async (fastify) => {
  fastify.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
    const traceId = randomUUID();
    request.id = traceId;
    request.traceId = request.id;
    request.log = fastify.log.child({
      reqId: traceId,
      traceId: traceId,
    });
    request.log.info(`Generated request id ${request.id}`);
    reply.header('x-go-trace-id', request.id);
  });
});

declare module 'fastify' {
  interface FastifyRequest {
    traceId: string;
  }
}
