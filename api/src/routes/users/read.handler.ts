import { FastifyRequest, FastifyReply } from 'fastify';

import { ApiError } from '../../model/error.js';
import { ReadUserResponse, UserItem } from '../../schemas/index.js';
import env from '../../util/env.js';
import ddb from '../../aws/ddb.js';

const readUserHandler = async (request: FastifyRequest, reply: FastifyReply<ReadUserResponse>) => {
  const user = request.user;

  if (!(user?.sub && user?.email)) {
    throw new ApiError(400, 'Missing identity in the access token');
  }

  const userItem = await ddb.get<UserItem>(env.USERS_TABLE, user.sub);
  return reply.code(200).send(userItem);
};

export { readUserHandler };
