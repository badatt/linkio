import { FastifyRequest, FastifyReply, RouteShorthandOptions, RequestGenericInterface } from 'fastify';

import env from '../../util/env.js';
import ddb from '../../aws/ddb.js';

const UpsertUserSchema = {
  body: {
    title: 'Upsert user request schema',
    type: 'object',
    additionalProperties: false,
    properties: {
      isAnonymous: {
        type: 'boolean',
      },
      createdAt: {
        type: 'number',
      },
      lastLoginAt: {
        type: 'number',
      },
    },
    required: ['isAnonymous', 'createdAt', 'lastLoginAt'],
  },
};

const upsertUserHandlerOptions: RouteShorthandOptions = {
  schema: UpsertUserSchema,
};

interface UpsertUserRequest extends RequestGenericInterface {
  Body: {
    isAnonymous: boolean;
    createdAt: number;
    lastLoginAt: number;
  }
}

const upsertUserHandler = async (request: FastifyRequest<UpsertUserRequest>, reply: FastifyReply) => {
  const user = request.user;

  if (!user || !user.sub || !user.email) {
    return reply.code(400).send({ error: 'Missing identity in the access token' });
  }

  const body = {
    isAnonymous: request.body.isAnonymous,
    createdAt: request.body.createdAt,
    lastLoginAt: request.body.lastLoginAt,
  }
  
  const userItem = {
    uid: user.sub,
    email: user.email,
    name: user.name,
    picture: user.picture,
    emailVerified: user.email_verified,
    firebase: {
      signInProvider: user.firebase.sign_in_provider,
    },
    ...body
  }
  const existingUser = await ddb.get(env.USERS_TABLE, userItem.uid);
  if (existingUser) {
    await ddb.update(env.USERS_TABLE, userItem.uid, {  ...request.body });
  } else {
     await ddb.put(env.USERS_TABLE, userItem);
  }
 
  return reply.code(201).header('Location', `${request.url}/${userItem.uid}`).send();
};

export { upsertUserHandlerOptions , upsertUserHandler, UpsertUserRequest };
