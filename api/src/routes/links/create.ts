import { FastifyRequest, FastifyReply, RouteShorthandOptions, RequestGenericInterface } from 'fastify';
import { nanoid } from 'nanoid';

import env from '../../util/env.js';
import s3 from '../../aws/s3.js';

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
  const bucketName = env.LINKS_STORAGE_BUCKET_NAME;
  let exists;
  let slug;

  do {
    slug = nanoid(6);
    exists = await s3.checkIfObjectExists(bucketName, slug);
  } while (exists);

  await s3.putLinkObject(bucketName, slug, new URL(request.body.url));
  const location = `${request.protocol}://${request.headers.host}/${slug}`;
  const minifiedUrl = `${request.headers.host}/${slug}`;
  return reply.code(201).header('Location', location).send({ slug, location: minifiedUrl });
};

export { createLinkHandlerOptions, createLinkHandler, CreateLinkRequest };
