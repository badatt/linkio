import { FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';

export default fp(async (fastify) => {
  fastify.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
    console.log(`Generated request id ${request.id}`);
    request.traceId = request.id;
    reply.header('x-go-trace-id', request.id);
  });
});

declare module 'fastify' {
  interface FastifyRequest {
    traceId: string;
  }
}
