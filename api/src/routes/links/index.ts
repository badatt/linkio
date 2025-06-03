import { FastifyInstance, FastifyPluginAsync } from 'fastify';

import { CreateLinkRequest, CreateLinkSchema, ReadLinkRequest, ReadLinkSchema } from '../../schemas/index.js';
import { createLinkHandler } from './create.handler.js';
import { readLinkHandler } from './read.handler.js';

const handlers: FastifyPluginAsync = async (fastify: FastifyInstance): Promise<void> => {
  fastify.post<CreateLinkRequest>('/', { schema: CreateLinkSchema }, createLinkHandler);
  fastify.get<ReadLinkRequest>('/:slug', { schema: ReadLinkSchema }, readLinkHandler);
};

const route: FastifyPluginAsync = async (fastify): Promise<void> => {
  await fastify.register(handlers, { prefix: '/links' });
};

export default route;
