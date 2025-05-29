import { FastifyPluginAsync } from 'fastify';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const route: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fastify.get('/', async function (request, reply) {
    return { root: true };
  });
};

const root: FastifyPluginAsync = async (fastify): Promise<void> => {
  await fastify.register(route, { prefix: '/' });
};

export default root;
