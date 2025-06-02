import fp from 'fastify-plugin';
import admin from 'firebase-admin';

import env from '../util/env.js';
import { ApiError } from '../util/error.js';

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

  fastify.decorate('verifyFirebaseToken', async (token: string) => {
    try {
      return await admin.auth().verifyIdToken(token);
    } catch {
      throw new ApiError(401, 'Invalid Firebase token', 'UNAUTHORIZED');
    }
  });

  fastify.decorate('authPreHandler', async (request) => {
    const auth = request.headers.authorization;
    if (!auth?.startsWith('Bearer ')) {
      throw new ApiError(401, 'Missing or invalid Authorization header', 'UNAUTHORIZED');
    }
    const token = auth.split(' ')[1];
    const decoded = await fastify.verifyFirebaseToken(token);
    request.user = decoded;
  });
});

declare module 'fastify' {
  interface FastifyInstance {
    verifyFirebaseToken(token: string): Promise<admin.auth.DecodedIdToken>;
    authPreHandler: (request: FastifyRequest) => Promise<void>;
  }
  interface FastifyRequest {
    user?: admin.auth.DecodedIdToken;
  }
}
