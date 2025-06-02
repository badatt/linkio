import { AutoloadPluginOptions } from '@fastify/autoload';
import { FastifyPluginAsync } from 'fastify';
import cors from '@fastify/cors';

import env from './util/env.js';
import routes from './routes/index.js';
import plugins from './plugins/index.js';

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;

// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const app: FastifyPluginAsync<AppOptions> = async (fastify, opts): Promise<void> => {
  

  for (const plugin of plugins) {
    await fastify.register(plugin);
  }

  for (const route of routes) {
    await fastify.register(route);
  }

  const allowedOrigins = ['http://localhost:3001', env.ALLOWED_ORIGINS];

  await fastify.register(cors, {
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) {
        cb(null, true); // allow request
      } else {
        cb(new Error('Not allowed by CORS'), false); // reject request
      }
    },
  });

};

export default app;
export { app, options };
