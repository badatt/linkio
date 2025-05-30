import { FastifyRequest, FastifyReply, RouteShorthandOptions, RequestGenericInterface } from 'fastify';

import { uploadLinkObject } from '../../aws/s3.js';

const createLinkSchema = {
  body: {
    type: 'object',
    required: ['url'],
    properties: {
      url: { type: 'string', format: 'uri' },
    },
  },
};

const createLinkHandlerOptions: RouteShorthandOptions = {
  schema: createLinkSchema,
};

interface CreateLinkRequest extends RequestGenericInterface {
  Body: { url: string };
}

const createLinkHandler = async (request: FastifyRequest<CreateLinkRequest>, reply: FastifyReply) => {
  const slug = await uploadLinkObject(request.body.url);
  return reply.code(201).send({ slug });
};

export { createLinkHandlerOptions, createLinkHandler, CreateLinkRequest };
