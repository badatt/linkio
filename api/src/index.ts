import awsLambdaFastify from '@fastify/aws-lambda';
import Fastify, { FastifyInstance } from 'fastify';

import { app, options } from './app';

const fastify: FastifyInstance = Fastify();
fastify.register(app, options);

const proxy = awsLambdaFastify(fastify);

export const handler = proxy;
