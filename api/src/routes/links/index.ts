import { FastifyInstance, FastifyPluginAsync } from 'fastify';

import {
  CreateLinkRequest,
  CreateLinkSchema,
  ReadAllLinksRequest,
  ReadLinkRequest,
  ReadAllLinksSchema,
  ReadLinkSchema,
} from '../../schemas/index.js';
import { createLinkHandler } from './create.handler.js';
import { readAllLinksHandler, readLinkHandler } from './read.handler.js';

const handlers: FastifyPluginAsync = async (fastify: FastifyInstance): Promise<void> => {
  fastify.post<CreateLinkRequest>(
    '/',
    {
      schema: CreateLinkSchema,
      preHandler: [
        await fastify.verifyRecaptchaPreHandler({ action: 'CreateLink' }),
        await fastify.authPreHandler({ guest: true }),
      ],
    },
    createLinkHandler,
  );
  fastify.get<ReadAllLinksRequest>(
    '/',
    { schema: ReadAllLinksSchema, preHandler: [await fastify.authPreHandler()] },
    readAllLinksHandler,
  );
  fastify.get<ReadLinkRequest>('/:slug', { schema: ReadLinkSchema }, readLinkHandler);
};

const route: FastifyPluginAsync = async (fastify): Promise<void> => {
  await fastify.register(handlers, { prefix: '/links' });
};

export default route;
