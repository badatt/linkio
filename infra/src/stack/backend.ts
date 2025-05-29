import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ICertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { HostedZone } from 'aws-cdk-lib/aws-route53';

import { Context } from '../context';
import { Storage } from '../construct/storage';
import { Api } from '../construct/api';
import { CloudFront } from '../construct/cloudfront';
import { Lambda } from '../construct/lambda';
import { DynamoDb } from '../construct/db';

type Props = StackProps & {
  cloudfrontCertificate: ICertificate;
};

export class BackendStack extends Stack {
  constructor(scope: Construct, id: string, ctx: Context, props: Props) {
    super(scope, id, props);

    // API function handler
    const apiFunction = new Lambda(this, ctx, {
      id: 'ApiFunction',
    });

    // Links storage bucket
    const linksStorage = new Storage(this, ctx, {
      id: 'LinksStorage',
      objectExpirationDays: 28,
    });

    linksStorage.grandReadAndWriteAccess(apiFunction.handler);
    apiFunction.addEnv('LINKS_STORAGE_BUCKET_NAME', linksStorage.bucket.bucketName);

    // Dynamo DB tables
    const db = new DynamoDb(this, ctx, {
      id: 'Db',
    });

    db.grandReadAndWriteAccess(apiFunction.handler);
    db.tables.forEach((table, name) => {
      apiFunction.addEnv(name, table.tableName);
    });

    // Http API
    const api = new Api(this, ctx, {
      id: 'Api',
      handler: apiFunction.handler,
    });

    // Hosted Zone
    const hostedZone = HostedZone.fromHostedZoneAttributes(this, `${ctx.props.appName}HostedZone`, {
      hostedZoneId: ctx.props.hostedZoneId,
      zoneName: ctx.props.rootDomain,
    });

    api.addCustomApiDomain({
      domain: ctx.props.apiDomain,
      hostedZone,
    });

    // Cloudfront distribution CDN
    new CloudFront(this, ctx, {
      id: 'AppCloudFront',
      origin: linksStorage.bucket,
      certificate: props.cloudfrontCertificate,
      domain: ctx.props.appDomain,
      hostedZone: hostedZone,
    });
  }
}
