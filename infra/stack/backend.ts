import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {Bucket} from 'aws-cdk-lib/aws-s3';

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const s3 = new Bucket(this, 'LinkStore', {
    });
  }
}
