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

  if (env.IS_LOCAL_ENV) {
    return reply.code(200).send({
      uid: user.sub,
      email: user.email,
      name: user.name,
      picture: user.picture,
      emailVerified: user.email_verified,
      firebase: {
        signInProvider: user.firebase.sign_in_provider,
      },
      isAnonymous: false,
      createdAt: 0,
      lastLoginAt: 0,
    });
  }

  const userItem = await ddb.get<UserItem>(env.USERS_TABLE, user.sub);
  return reply.code(200).send(userItem);
};

export { readUserHandler };
