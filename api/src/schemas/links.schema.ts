import { Type, Static } from '@sinclair/typebox';
import { FastifySchema } from 'fastify';

import { errorSchemas } from './error.schema.js';

/* Create link schema */
const CreateLinkBodySchema = Type.Object(
  {
    url: Type.String({ format: 'uri' }),
  },
  {
    title: 'Create link request schema',
  },
);

const CreateLinkResponseSchema = Type.Object(
  {
    slug: Type.String(),
    location: Type.String({ format: 'uri' }),
  },
  {
    title: 'Create link response schema',
  },
);

const CreateLinkSchema: FastifySchema = {
  body: CreateLinkBodySchema,
  response: {
    201: CreateLinkResponseSchema,
    ...errorSchemas([406, 414]),
  },
};

type CreateLinkBody = Static<typeof CreateLinkBodySchema>;
type CreateLinkReply = Static<typeof CreateLinkResponseSchema>;

interface CreateLinkRequest {
  Body: CreateLinkBody;
  Reply: CreateLinkReply;
}

interface CreateLinkResponse {
  Reply: CreateLinkReply;
}

/* Read link schema */
const ReadLinkParamsSchema = Type.Object(
  {
    slug: Type.String(),
  },
  {
    title: 'Read link request schema',
  },
);

const ReadLinkResponseSchema = Type.Object(
  {
    slug: Type.String(),
    location: Type.String({ format: 'uri' }),
  },
  {
    title: 'Read link response schema',
  },
);

const ReadLinkSchema: FastifySchema = {
  params: ReadLinkParamsSchema,
  response: {
    200: ReadLinkResponseSchema,
    ...errorSchemas([404]),
  },
};

type ReadLinkParams = Static<typeof ReadLinkParamsSchema>;
type ReadLinkReply = Static<typeof ReadLinkResponseSchema>;

interface ReadLinkRequest {
  Params: ReadLinkParams;
  Reply: ReadLinkReply;
}

interface ReadLinkResponse {
  Reply: ReadLinkReply;
}

export { CreateLinkSchema, CreateLinkRequest, CreateLinkResponse, ReadLinkSchema, ReadLinkRequest, ReadLinkResponse };
