#!/usr/bin/env node
import { App } from 'aws-cdk-lib';
import { Context } from '../context';
import { BackendStack } from "../stack/backend";

const app = new App();
const ctx = Context.getInstance();

const backendStack = new BackendStack(app, "BackendStack", ctx, {
  env: {
    account: process.env.AWS_ACCOUNT_ID,
    region: process.env.AWS_DEFAULT_REGION,
  },
});

console.log(`Backend stack name: ${backendStack.stackName}`);