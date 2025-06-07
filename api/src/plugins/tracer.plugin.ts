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
    request.log.info(request);
  });

  fastify.addHook('onSend', async (request: FastifyRequest, reply: FastifyReply) => {
    reply.header('x-go-trace-id', request.id);
    request.log.info(reply);
  });
});
