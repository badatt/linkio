import { FastifyRequest, FastifyReply } from 'fastify';

import { ApiError } from '../../model/error.js';
import env from '../../util/env.js';
import ddb from '../../aws/ddb.js';
import { UpsertUserRequest, UpsertUserResponse, UserItem } from '../../schemas/index.js';

const upsertUserHandler = async (
  request: FastifyRequest<UpsertUserRequest>,
  reply: FastifyReply<UpsertUserResponse>,
) => {
  const user = request.user;

  if (!user?.sub || !user?.email) {
    throw new ApiError(400, 'Missing identity in the access token');
  }

  const requestUserItem: UserItem = {
    uid: user.sub,
    email: user.email,
    name: user.name,
    picture: user.picture,
    emailVerified: user.email_verified,
    firebase: {
      signInProvider: user.firebase.sign_in_provider,
    },
    ...request.body,
  };

  const existingUser = await ddb.exists(env.USERS_TABLE, requestUserItem.uid);
  let responseUserItem: UserItem;
  if (existingUser) {
    responseUserItem = await ddb.update<UserItem>(env.USERS_TABLE, requestUserItem.uid, { ...request.body });
  } else {
    responseUserItem = await ddb.create<UserItem>(env.USERS_TABLE, requestUserItem);
  }

  return reply
    .code(201)
    .header('Location', `${request.url}/${requestUserItem.uid}`)
    .send({
      isNew: !existingUser,
      ...responseUserItem,
    });
};

export { upsertUserHandler };
