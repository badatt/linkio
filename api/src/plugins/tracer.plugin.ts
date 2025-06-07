import { randomUUID } from 'crypto';
import { FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';

export default fp(async (fastify) => {
  fastify.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
    const traceId = randomUUID();
    request.traceId = traceId;
    request.id = traceId;
    reply.header('x-go-trace-id', traceId);
  });
});

declare module 'fastify' {
  interface FastifyRequest {
    traceId: string;
  }
}
