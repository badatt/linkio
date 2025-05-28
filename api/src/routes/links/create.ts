import { FastifyRequest, FastifyReply, RouteShorthandOptions, RequestGenericInterface } from 'fastify';

import { uploadLinkObject } from '../../aws/s3';

const createLinkSchema = {
  body: {
    type: 'object',
    required: ['link'],
    properties: {
      link: { type: 'string', format: 'uri' },
    },
  },
};

const createLinkHandlerOptions: RouteShorthandOptions = {
  schema: createLinkSchema,
};

interface CreateLinkRequest extends RequestGenericInterface {
  Body: { link: string };
}

const createLinkHandler = async (request: FastifyRequest<CreateLinkRequest>, reply: FastifyReply) => {
  const slug = await uploadLinkObject(request.body.link);
  return reply.code(201).send({ slug });
};

export { createLinkHandlerOptions, createLinkHandler, CreateLinkRequest };
