import ajv from './ajv.plugin.js';
import errorHandler from './error-handler.plugin.js';
import auth from './firebase-auth.plugin.js';
import sensible from './sensible.plugin.js';
import tracer from './tracer.plugin.js';
import reCaptcha from './recaptcha.plugin.js';

export default [tracer, ajv, auth, sensible, errorHandler, reCaptcha];
