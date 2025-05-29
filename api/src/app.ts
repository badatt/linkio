import { AutoloadPluginOptions } from '@fastify/autoload';
import { FastifyPluginAsync } from 'fastify';
import cors from '@fastify/cors';

import env from './util/env';
import routes from './routes';
import plugins from './plugins';

export type AppOptions = {
  // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;

// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {};

const app: FastifyPluginAsync<AppOptions> = async (fastify): Promise<void> => {
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
