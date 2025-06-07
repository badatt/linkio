import { FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import { randomUUID } from 'crypto';

export default fp(async (fastify) => {
  fastify.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
    const traceId = randomUUID();
    request.id = traceId;
    request.traceId = traceId;
    console.log(`Generated request id ${request.id}`);
    reply.header('x-go-trace-id', request.id);
    request.log = request.log.child({ traceId });
  });
});

declare module 'fastify' {
  interface FastifyRequest {
    traceId: string;
  }
}
