import { FastifyRequest, FastifyReply } from 'fastify';

import { ApiError } from '../../model/error.js';
import env from '../../util/env.js';
import s3 from '../../aws/s3.js';
import { ReadLinkRequest, ReadLinkResponse } from '../../schemas/index.js';

const readLinkHandler = async (request: FastifyRequest<ReadLinkRequest>, reply: FastifyReply<ReadLinkResponse>) => {
  const bucketName = env.LINKS_STORAGE_BUCKET_NAME;
  const linkObject = await s3.getObject(bucketName, request.params.slug);
  const location = linkObject.WebsiteRedirectLocation;

  if (!location) {
    throw new ApiError(404, 'Link not found');
  }

  return reply.code(200).send({ slug: request.params.slug, location });
};

export { readLinkHandler };
