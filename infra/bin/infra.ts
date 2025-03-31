#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { BackendStack } from "../stack/backend";

const app = new cdk.App();
const backendStack = new BackendStack(app, "BackendStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

console.log(`Backend deployed: ${backendStack.stackName}`);