import { FastifyInstance, FastifyPluginAsync } from 'fastify';

import { CreateUserRequest, createUserHandler, createUserHandlerOptions } from './create.js';
import { ReadUserRequest, readUserHandler, readUserHandlerOptions } from './read.js';

const handlers: FastifyPluginAsync = async (fastify: FastifyInstance): Promise<void> => {
  fastify.post<CreateUserRequest>('/', createUserHandlerOptions, createUserHandler);
  fastify.get<ReadUserRequest>('/:uid', readUserHandlerOptions, readUserHandler);
};

const route: FastifyPluginAsync = async (fastify): Promise<void> => {
  await fastify.register(handlers, { prefix: '/users' });
};

export default route;
