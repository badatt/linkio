import { FastifyInstance, FastifyPluginAsync } from 'fastify';

import { AppOptions } from '../../app';
import { CreateLinkRequest, createLinkHandler, createLinkHandlerOptions } from './create';
import { ReadLinkRequest, readLinkHandler, readLinkHandlerOptions } from './read';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const links: FastifyPluginAsync = async (fastify: FastifyInstance, opts: AppOptions): Promise<void> => {
  fastify.post<CreateLinkRequest>('/', createLinkHandlerOptions, createLinkHandler);
  fastify.get<ReadLinkRequest>('/:slug', readLinkHandlerOptions, readLinkHandler);
};

export default links;
