import { FastifyInstance, FastifyPluginAsync } from 'fastify';

import { AppOptions } from '@/app';

import { CreateLinkRequest, createLinkHandler, createLinkHandlerOptions } from './create';
import { ReadLinkRequest, readLinkHandler, readLinkHandlerOptions } from './read';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const route: FastifyPluginAsync = async (fastify: FastifyInstance, opts: AppOptions): Promise<void> => {
  fastify.post<CreateLinkRequest>('/', createLinkHandlerOptions, createLinkHandler);
  fastify.get<ReadLinkRequest>('/:slug', readLinkHandlerOptions, readLinkHandler);
};

const links: FastifyPluginAsync = async (fastify): Promise<void> => {
  await fastify.register(route, { prefix: '/links' });
};

export default links;
