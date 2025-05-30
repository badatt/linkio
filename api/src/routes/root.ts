import os from 'node:os';
import { FastifyPluginAsync } from 'fastify';

const handlers: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get('/', async function (request, reply) {
    const systemInfo = {
      hostname: os.hostname(),
      homedir: os.homedir(),
      tempdir: os.tmpdir(),
      memory: {
        total: os.totalmem(),
        free: os.freemem(),
      },
      os: {
        type: os.type(),
        machine: os.machine(),
        version: os.version(),
        platform: os.platform(),
        arch: os.arch(),
        cpus: os.cpus().length,
        networkInterfaces: os.networkInterfaces(),
      },
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      locale: Intl.DateTimeFormat().resolvedOptions().locale,
      uptime: os.uptime(),
      userInfo: os.userInfo(),
    };
    return reply.code(200).send({ healthy: true, systemInfo });
  });
};

const route: FastifyPluginAsync = async (fastify): Promise<void> => {
  await fastify.register(handlers, { prefix: '/' });
};

export default route;
