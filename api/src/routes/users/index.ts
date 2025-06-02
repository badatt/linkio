import { FastifyInstance, FastifyPluginAsync } from 'fastify';

import { UpsertUserRequest, upsertUserHandler, upsertUserHandlerOptions } from './create.js';
import { readUserHandler } from './read.js';

const handlers: FastifyPluginAsync = async (fastify: FastifyInstance): Promise<void> => {
  fastify.post<UpsertUserRequest>('/', { ...upsertUserHandlerOptions, preHandler: fastify.authPreHandler }, upsertUserHandler);
  fastify.get('/', { preHandler: fastify.authPreHandler }, readUserHandler);
};

const route: FastifyPluginAsync = async (fastify): Promise<void> => {
  await fastify.register(handlers, { prefix: '/users' });
};

export default route;
