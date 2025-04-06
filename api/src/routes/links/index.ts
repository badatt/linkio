import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { CreateLinkRequest, createLinkHandler, createLinkHandlerOptions } from './create.js';
import { ReadLinkRequest, readLinkHandler, readLinkHandlerOptions } from './read.js';
import { AppOptions } from 'app.js';

const links: FastifyPluginAsync = async (fastify: FastifyInstance, opts: AppOptions): Promise<void> => {
  fastify.post<CreateLinkRequest>('/', createLinkHandlerOptions, createLinkHandler);
  fastify.get<ReadLinkRequest>('/:slug', readLinkHandlerOptions, readLinkHandler);
};

export default links;
