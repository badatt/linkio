import { FastifyRequest, FastifyReply, RouteShorthandOptions, RequestGenericInterface } from 'fastify';

import env from '../../util/env.js';
import s3 from '../../aws/s3.js';

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
  const bucketName = env.LINKS_STORAGE_BUCKET_NAME;
  const linkObject = await s3.getObject(bucketName, request.params.slug);
  return reply.code(200).send({ slug: request.params.slug, url: linkObject.WebsiteRedirectLocation });
};

export { readLinkHandlerOptions, readLinkHandler, ReadLinkRequest };
