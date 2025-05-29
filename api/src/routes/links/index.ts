import { FastifyInstance, FastifyPluginAsync } from 'fastify';

import { CreateLinkRequest, createLinkHandler, createLinkHandlerOptions } from './create';
import { ReadLinkRequest, readLinkHandler, readLinkHandlerOptions } from './read';

const route: FastifyPluginAsync = async (fastify: FastifyInstance): Promise<void> => {
  fastify.post<CreateLinkRequest>('/', createLinkHandlerOptions, createLinkHandler);
  fastify.get<ReadLinkRequest>('/:slug', readLinkHandlerOptions, readLinkHandler);
};

const links: FastifyPluginAsync = async (fastify): Promise<void> => {
  await fastify.register(route, { prefix: '/links' });
};

export default links;
