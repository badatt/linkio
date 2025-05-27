import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ICertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { HostedZone } from 'aws-cdk-lib/aws-route53';

import { Context } from '../context';
import { Storage } from '../construct/storage';
import { Api } from '../construct/api';
import { CloudFront } from '../construct/cloudfront';

type Props = StackProps & {
  cloudfrontCertificate: ICertificate;
};

export class BackendStack extends Stack {
  constructor(scope: Construct, id: string, ctx: Context, props: Props) {
    super(scope, id, props);

    const linksStorage = new Storage(this, ctx, {
      id: 'LinksStorage',
      objectExpirationDays: 28,
    });

    const api = new Api(this, ctx, {
      id: 'Api',
    });

    linksStorage.grandReadAndWriteAccess(api.apiFunction);
    api.addEnv('LINKS_STORAGE_BUCKET_NAME', linksStorage.bucket.bucketName);

    const hostedZone = HostedZone.fromHostedZoneAttributes(this, `${ctx.props.appName}HostedZone`, {
      hostedZoneId: ctx.props.hostedZoneId,
      zoneName: ctx.props.rootDomain,
    });

    api.addCustomApiDomain({
      domain: ctx.props.apiDomain,
      hostedZone,
    });

    new CloudFront(this, ctx, {
      id: 'AppCloudFront',
      origin: linksStorage.bucket,
      certificate: props.cloudfrontCertificate,
      domain: ctx.props.appDomain,
      hostedZone: hostedZone,
    });
  }
}
