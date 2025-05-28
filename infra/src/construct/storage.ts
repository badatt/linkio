import { Construct } from 'constructs';
import { BlockPublicAccess, Bucket } from 'aws-cdk-lib/aws-s3';
import { Duration, RemovalPolicy } from 'aws-cdk-lib';
import { Effect, IGrantable, PolicyStatement, StarPrincipal } from 'aws-cdk-lib/aws-iam';

import { BaseConstruct } from './base';
import { Context } from '../context';
import { BaseProps } from '../types';

interface StorageProps extends BaseProps {
  objectExpirationDays: number;
}

export class Storage extends BaseConstruct {
  public readonly bucket: Bucket;

  constructor(scope: Construct, ctx: Context, props: StorageProps) {
    super(scope, ctx, props);

    this.bucket = new Bucket(this, this.id, {
      removalPolicy: ctx.isProd ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
      autoDeleteObjects: !ctx.isProd,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: '404.html',
      blockPublicAccess: new BlockPublicAccess({
        blockPublicAcls: false,
        ignorePublicAcls: false,
        blockPublicPolicy: false,
        restrictPublicBuckets: false,
      }),
    });
    this.out('Bucket', this.bucket.bucketName);

    this.bucket.addLifecycleRule({
      expiration: Duration.days(props.objectExpirationDays),
      enabled: true,
      tagFilters: {
        link: 'true',
      },
    });

    this.bucket.addToResourcePolicy(
      new PolicyStatement({
        actions: ['s3:GetObject'],
        effect: Effect.ALLOW,
        principals: [new StarPrincipal()],
        resources: [this.bucket.arnForObjects('*')],
      }),
    );
  }

  public grandReadAndWriteAccess(identity: IGrantable) {
    this.bucket.grantReadWrite(identity);
  }
}
