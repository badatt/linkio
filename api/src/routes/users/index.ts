import { FastifyInstance, FastifyPluginAsync } from 'fastify';

import { ReadUserSchema, ReadUserRequest, UpsertUserRequest, UpsertUserSchema } from '../../schemas/users.schema.js';
import { upsertUserHandler } from './create.handler.js';
import { readUserHandler } from './read.handler.js';

const handlers: FastifyPluginAsync = async (fastify: FastifyInstance): Promise<void> => {
  fastify.post<UpsertUserRequest>(
    '/',
    { schema: UpsertUserSchema, preHandler: [await fastify.authPreHandler()] },
    upsertUserHandler,
  );
  fastify.get<ReadUserRequest>(
    '/me',
    { schema: ReadUserSchema, preHandler: [await fastify.authPreHandler()] },
    readUserHandler,
  );
};

const route: FastifyPluginAsync = async (fastify): Promise<void> => {
  await fastify.register(handlers, { prefix: '/users' });
};

export default route;
