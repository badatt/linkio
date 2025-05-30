import { FastifyRequest, FastifyReply, RouteShorthandOptions, RequestGenericInterface } from 'fastify';

import env from '../../util/env.js';
import ddb from '../../aws/ddb.js';

const createUserSchema = {
  body: {
    title: 'Create user request schema',
    type: 'object',
    properties: {
      uid: {
        type: 'string',
      },
      email: {
        type: 'string',
        format: 'email',
      },
      emailVerified: {
        type: 'boolean',
      },
      displayName: {
        type: 'string',
      },
      isAnonymous: {
        type: 'boolean',
      },
      photoURL: {
        type: 'string',
        format: 'uri',
      },
      createdAt: {
        type: 'string',
      },
      lastLoginAt: {
        type: 'string',
      },
    },
    required: ['uid', 'email', 'emailVerified', 'displayName', 'isAnonymous', 'photoURL', 'createdAt', 'lastLoginAt'],
  },
};

const createUserHandlerOptions: RouteShorthandOptions = {
  schema: createUserSchema,
};

interface CreateUserRequest extends RequestGenericInterface {
  Body: {
    uid: string;
    email: string;
    emailVerified: boolean;
    displayName: string;
    isAnonymous: boolean;
    photoURL: string;
    createdAt: string;
    lastLoginAt: string;
  };
}

const createUserHandler = async (request: FastifyRequest<CreateUserRequest>, reply: FastifyReply) => {
  await ddb.put(env.USERS_TABLE, request.body);
  return reply.code(201).header('Location', `${request.url}/${request.body.uid}`).send();
};

export { createUserHandlerOptions, createUserHandler, CreateUserRequest };
