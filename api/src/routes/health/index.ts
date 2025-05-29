import { FastifyPluginAsync } from 'fastify';
import os from 'node:os';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const route: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fastify.get('/', async function (request, reply) {
    const systemInfo = {
      hostname: os.hostname(),
      platform: os.platform(),
      arch: os.arch(),
      cpus: os.cpus().length,
      memory: {
        total: os.totalmem(),
        free: os.freemem(),
      },
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      locale: Intl.DateTimeFormat().resolvedOptions().locale,
      uptime: os.uptime(),
      userInfo: os.userInfo(),
    };
    return { healthy: true, systemInfo };
  });
};

const health: FastifyPluginAsync = async (fastify): Promise<void> => {
  await fastify.register(route, { prefix: '/health' });
};

export default health;
