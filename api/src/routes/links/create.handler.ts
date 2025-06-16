import { FastifyRequest, FastifyReply } from 'fastify';
import { nanoid } from 'nanoid';

import env from '../../util/env.js';
import { ApiError } from '../../model/error.js';
import s3 from '../../aws/s3.js';
import ddb from '../../aws/ddb.js';
import { CreateLinkRequest, CreateLinkResponse } from '../../schemas/index.js';

const createLinkHandler = async (
  request: FastifyRequest<CreateLinkRequest>,
  reply: FastifyReply<CreateLinkResponse>,
) => {
  const bucketName = env.LINKS_STORAGE_BUCKET_NAME;
  const linksTable = env.LINKS_TABLE;
  let exists;
  let slug;

  if (request.body.url.length > 8192) {
    throw new ApiError(414, 'The URL is too long');
  }

  do {
    slug = nanoid(6);
    exists = await s3.checkIfObjectExists(bucketName, slug);
  } while (exists);

  await s3.putLinkObject(bucketName, slug, new URL(request.body.url));
  request.log.info(`Generated slug ${slug}`);
  if (request.user) {
    await ddb.create(linksTable, {
      uid: slug,
      createdByEmail: request.user.email,
      createdByUid: request.user.uid,
      createdAt: Date.now(),
    });
  }
  return reply.code(201).header('Location', `/${slug}`).send({ slug });
};

export { createLinkHandler };
