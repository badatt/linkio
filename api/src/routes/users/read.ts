import { FastifyRequest, FastifyReply } from 'fastify';

import env from '../../util/env.js';
import ddb from '../../aws/ddb.js';

const readUserHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const user = request.user;

  if (!user || !user.sub || !user.email) {
    return reply.code(400).send({ error: 'Missing identity in the access token' });
  }
  
  const userItem = await ddb.get(env.USERS_TABLE, user.sub);
  return reply.code(200).send(userItem);
};

export { readUserHandler };
