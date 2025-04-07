import { FastifyPluginAsync } from 'fastify';
import os from 'node:os';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const example: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
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

export default example;
