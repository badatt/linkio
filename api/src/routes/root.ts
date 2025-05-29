import os from 'node:os';
import { FastifyPluginAsync } from 'fastify';

const route: FastifyPluginAsync = async (fastify): Promise<void> => {
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
    return reply.code(200).send({ health: true, systemInfo });
  });
};

const root: FastifyPluginAsync = async (fastify): Promise<void> => {
  await fastify.register(route, { prefix: '/' });
};

export default root;
