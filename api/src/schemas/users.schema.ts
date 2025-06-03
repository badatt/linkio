import { Type, Static } from '@sinclair/typebox';
import { FastifySchema } from 'fastify';

import { errorSchemas } from './error.schema.js';

const UserItemSchema = {
  uid: Type.String(),
  email: Type.Optional(Type.String()),
  name: Type.Optional(Type.String()),
  picture: Type.Optional(Type.String()),
  emailVerified: Type.Optional(Type.Boolean()),
  firebase: Type.Optional(
    Type.Object({
      signInProvider: Type.Optional(Type.String()),
    }),
  ),
  createdAt: Type.Number(),
  lastLoginAt: Type.Number(),
  isAnonymous: Type.Boolean(),
};

/* Insert / Update user schema  */
const UpsertUserBodySchema = Type.Object(
  {
    isAnonymous: Type.Boolean(),
    createdAt: Type.Number(),
    lastLoginAt: Type.Number(),
  },
  {
    title: 'Upsert user request schema',
  },
);

const UpsertUserResponseSchema = Type.Object(
  {
    isNew: Type.Boolean(),
    ...UserItemSchema,
  },
  {
    title: 'Upsert user response schema',
  },
);

const UpsertUserSchema: FastifySchema = {
  body: UpsertUserBodySchema,
  response: {
    201: UpsertUserResponseSchema,
    ...errorSchemas([400, 406]),
  },
};

type UpsertUserBody = Static<typeof UpsertUserBodySchema>;
type UpsertUserReply = Static<typeof UpsertUserResponseSchema>;

interface UpsertUserRequest {
  Body: UpsertUserBody;
  Reply: UpsertUserReply;
}

interface UpsertUserResponse {
  Reply: UpsertUserReply;
}

type UserItem = Omit<UpsertUserReply, 'isNew'>;

/* Read user schema */

const ReadUserResponseSchema = Type.Object(
  {
    ...UserItemSchema,
  },
  {
    title: 'Read user response schema',
  },
);

const ReadUserSchema: FastifySchema = {
  response: {
    200: ReadUserResponseSchema,
    ...errorSchemas([404]),
  },
};

type ReadUserReply = Static<typeof ReadUserResponseSchema>;

interface ReadUserRequest {
  Reply: ReadUserReply;
}

interface ReadUserResponse {
  Reply: ReadUserReply;
}

export {
  ReadUserRequest,
  ReadUserResponse,
  ReadUserSchema,
  UpsertUserSchema,
  UpsertUserRequest,
  UpsertUserResponse,
  UserItem,
};
