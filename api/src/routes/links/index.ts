import { FastifyInstance, FastifyPluginAsync } from 'fastify';

import { CreateLinkRequest, createLinkHandler, createLinkHandlerOptions } from './create.js';
import { ReadLinkRequest, readLinkHandler, readLinkHandlerOptions } from './read.js';

const handlers: FastifyPluginAsync = async (fastify: FastifyInstance): Promise<void> => {
  fastify.post<CreateLinkRequest>('/', createLinkHandlerOptions, createLinkHandler);
  fastify.get<ReadLinkRequest>('/:slug', readLinkHandlerOptions, readLinkHandler);
};

const route: FastifyPluginAsync = async (fastify): Promise<void> => {
  await fastify.register(handlers, { prefix: '/links' });
};

export default route;
