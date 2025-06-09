import fp from 'fastify-plugin';
import fetch from 'node-fetch';
import { FastifyRequest, FastifyReply } from 'fastify';

import env from '../util/env.js';
import { ApiError } from '../model/error.js';

export interface RecaptchaVerifyOptions {
  action?: string;
}

declare module 'fastify' {
  interface FastifyRequest {
    recaptchaScore?: number;
    recaptchaAction?: string;
  }

  interface FastifyInstance {
    verifyRecaptcha: (request: FastifyRequest, options?: RecaptchaVerifyOptions) => Promise<void>;
    verifyRecaptchaPreHandler: (
      options?: RecaptchaVerifyOptions,
    ) => Promise<(req: FastifyRequest, reply: FastifyReply) => Promise<void>>;
  }
}

const verifyRecaptcha = async (request: FastifyRequest, options?: RecaptchaVerifyOptions): Promise<void> => {
  if (env.IS_LOCAL_ENV) {
    return;
  }
  const minScore = 0.5;
  const token = request.headers['x-recaptcha-token'];

  if (!token || typeof token !== 'string') {
    throw new ApiError(428, 'Missing reCAPTCHA token (x-recaptcha-token)');
  }

  const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${env.RECAPTCHA_SECRET_KEY}&response=${token}`,
  });

  const data = await res.json();
  request.log.info(data);

  if (!data.success || data.score < minScore) {
    throw new ApiError(403, 'Failed reCAPTCHA verification');
  }

  if (options?.action && data.action !== options.action) {
    throw new ApiError(403, 'Invalid reCAPTCHA action');
  }

  request.recaptchaScore = data.score;
  request.recaptchaAction = data.action;
};

const verifyRecaptchaPreHandler = async (
  options?: RecaptchaVerifyOptions,
): Promise<(req: FastifyRequest, reply: FastifyReply) => Promise<void>> => {
  return async (req: FastifyRequest) => {
    await req.server.verifyRecaptcha(req, { action: options?.action });
  };
};

export default fp(async (fastify) => {
  fastify.decorate('verifyRecaptcha', (request, options) => verifyRecaptcha(request, options));

  fastify.decorate('verifyRecaptchaPreHandler', (options) => verifyRecaptchaPreHandler(options));
});
