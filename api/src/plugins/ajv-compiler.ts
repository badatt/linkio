import fp from 'fastify-plugin';
import Ajv from 'ajv';
import ajvFormats from 'ajv-formats';

export default fp(async (fastify) => {
  fastify.log.info('Registering AJV compiler plugin');
  const ajv = new Ajv({
    removeAdditional: true, // optional: strip additional props
    useDefaults: true,      // optional: inject defaults from schema
    coerceTypes: true,      // optional: coerce types to match schema
    allErrors: true,        // optional: show all validation errors
    strict: false           // optional: allow relaxed schema rules
  });

  ajvFormats(ajv);

  fastify.setValidatorCompiler((schema) => {
    fastify.log.info('Compiling schema:', schema);
    return ajv.compile(schema);
  });

});