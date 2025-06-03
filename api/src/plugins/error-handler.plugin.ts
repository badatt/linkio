import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

export default fp(async (fastify) => {
  fastify.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
    const statusCode = error.statusCode ?? 500;
    const code = error.code ?? 'INTERNAL_SERVER_ERROR';

    reply.status(statusCode).send({
      code,
      message: error.message,
      trace: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
    });
  });
});
