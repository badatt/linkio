#!/usr/bin/env node
import { App } from 'aws-cdk-lib';

import { Context } from '../context';
import { BackendStack } from '../stack/backend';
import { CloudfrontCertificateStack } from '../stack/cf-certificate';

const app = new App();
const ctx = Context.getInstance();

const cloudfrontCertificateStack = new CloudfrontCertificateStack(
  app,
  `${ctx.props.appName}CloudfrontCertificateStack`,
  ctx,
  {
    env: {
      account: process.env.AWS_ACCOUNT_ID,
      region: 'us-east-1',
    },
    crossRegionReferences: true,
  },
);

const backendStack = new BackendStack(app, `${ctx.props.appName}BackendStack`, ctx, {
  cloudfrontCertificate: cloudfrontCertificateStack.certificate,
  env: {
    account: process.env.AWS_ACCOUNT_ID,
    region: process.env.AWS_DEFAULT_REGION,
  },
});

console.log(`Backend stack name: ${backendStack.stackName}`);
