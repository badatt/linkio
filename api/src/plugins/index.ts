import errorHandler from './error-handler.js';
import auth from './firebase-auth.js';
import sensible from './sensible.js';
import ajv from './ajv-compiler.js';

export default [ajv, auth, sensible, errorHandler];
