import fp from 'fastify-plugin';
import type { FastifyPluginAsync } from 'fastify';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajvPlugin: FastifyPluginAsync = async (fastify) => {
  const ajv = new Ajv({
    coerceTypes: false,
    useDefaults: true,
    allErrors: true,
    strict: true,
  });

  addFormats(ajv);

  fastify.setValidatorCompiler(({ schema }) => {
    if (schema) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bodySchema = schema as Record<string, any>;
      bodySchema.additionalProperties = false;
    }
    return ajv.compile(schema);
  });
};

export default fp(ajvPlugin, {
  name: 'ajv-plugin',
});
