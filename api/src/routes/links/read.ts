import { FastifyRequest, FastifyReply, RouteShorthandOptions, RequestGenericInterface } from 'fastify';

import { getFreeTierLinkObject } from '../../aws/s3.js';

const readLinkSchema = {
  params: {
    type: 'object',
    required: ['slug'],
    properties: {
      slug: { type: 'string' },
    },
  },
};

const readLinkHandlerOptions: RouteShorthandOptions = {
  schema: readLinkSchema,
};

interface ReadLinkRequest extends RequestGenericInterface {
  Params: { slug: string };
}

const readLinkHandler = async (request: FastifyRequest<ReadLinkRequest>, reply: FastifyReply) => {
  const fullUrl = await getFreeTierLinkObject(request.params.slug);
  return reply.code(201).send({ slug: request.params.slug, location: fullUrl });
};

export { readLinkHandlerOptions, readLinkHandler, ReadLinkRequest };
