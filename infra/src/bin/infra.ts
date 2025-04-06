#!/usr/bin/env node
import { App } from 'aws-cdk-lib';
import { Context } from '../context';
import { BackendStack } from '../stack/backend';
import { CertStack } from '../stack/cert';

const app = new App();
const ctx = Context.getInstance();

const backendStack = new BackendStack(app, `${ctx.props.appName}BackendStack`, ctx, {
  env: {
    account: process.env.AWS_ACCOUNT_ID,
    region: process.env.AWS_DEFAULT_REGION,
  },
});

console.log(`Backend stack name: ${backendStack.stackName}`);

const certStack = new CertStack(app, `${ctx.props.appName}CertStack`, ctx, {
  env: {
    account: process.env.AWS_ACCOUNT_ID,
    region: 'us-east-1',
  },
});

console.log(`Cert stack name: ${certStack.stackName}`);
