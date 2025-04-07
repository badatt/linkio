import { FastifyInstance, FastifyPluginAsync } from 'fastify';

import { AppOptions } from '../../app.js';
import { CreateLinkRequest, createLinkHandler, createLinkHandlerOptions } from './create.js';
import { ReadLinkRequest, readLinkHandler, readLinkHandlerOptions } from './read.js';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const links: FastifyPluginAsync = async (fastify: FastifyInstance, opts: AppOptions): Promise<void> => {
  fastify.post<CreateLinkRequest>('/', createLinkHandlerOptions, createLinkHandler);
  fastify.get<ReadLinkRequest>('/:slug', readLinkHandlerOptions, readLinkHandler);
};

export default links;
