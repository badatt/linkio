import fp from 'fastify-plugin';
import admin from 'firebase-admin';
import { FastifyRequest, FastifyReply } from 'fastify';

import env from '../util/env.js';
import { ApiError } from '../model/error.js';

export interface AuthOptions {
  guest?: boolean;
}

declare module 'fastify' {
  interface FastifyInstance {
    verifyFirebaseToken(token: string): Promise<admin.auth.DecodedIdToken>;
    authPreHandler: (options?: AuthOptions) => Promise<(request: FastifyRequest, reply: FastifyReply) => Promise<void>>;
  }
  interface FastifyRequest {
    user?: admin.auth.DecodedIdToken;
  }
}

const verifyFirebaseToken = async (token: string): Promise<admin.auth.DecodedIdToken> => {
  try {
    return await admin.auth().verifyIdToken(token);
  } catch {
    throw new ApiError(401, 'Invalid Firebase token', 'UNAUTHORIZED');
  }
};

const authPreHandler = async (options?: AuthOptions): Promise<(request: FastifyRequest) => Promise<void>> => {
  return async (request: FastifyRequest) => {
    const auth = request.headers.authorization;
    if (!auth && options?.guest) {
      return;
    }
    if (!auth?.startsWith('Bearer ')) {
      throw new ApiError(401, 'Missing or invalid Authorization header', 'UNAUTHORIZED');
    }
    const token = auth.split(' ')[1];
    const decoded = await request.server.verifyFirebaseToken(token);
    request.user = decoded;
  };
};

export default fp(async (fastify) => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: env.FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey: env.FIREBASE_PRIVATE_KEY,
      }),
    });
  }

  fastify.decorate('verifyFirebaseToken', verifyFirebaseToken);

  fastify.decorate('authPreHandler', (options) => authPreHandler(options));
});
