import { FastifyRequest, FastifyReply, RouteShorthandOptions, RequestGenericInterface } from 'fastify';

import env from '../../util/env.js';
import ddb from '../../aws/ddb.js';

const readUserSchema = {
  params: {
    type: 'object',
    required: ['uid'],
    properties: {
      uid: { type: 'string' },
    },
  },
};

const readUserHandlerOptions: RouteShorthandOptions = {
  schema: readUserSchema,
};

interface ReadUserRequest extends RequestGenericInterface {
  Params: { uid: string };
}

const readUserHandler = async (request: FastifyRequest<ReadUserRequest>, reply: FastifyReply) => {
  const user = await ddb.get(env.USERS_TABLE, request.params.uid);
  return reply.code(200).send(user);
};

export { readUserHandlerOptions, readUserHandler, ReadUserRequest };
