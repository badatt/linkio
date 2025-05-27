import { Construct } from 'constructs';
import { Context } from '../context';
import { BaseProps } from '../types';
import { BaseConstruct } from './base';
import { Distribution, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { S3StaticWebsiteOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { IBucket } from 'aws-cdk-lib/aws-s3';
import { ICertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { ARecord, IHostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';

interface CloudFrontProps extends BaseProps {
  origin: IBucket;
  certificate: ICertificate;
  domain: string;
  hostedZone: IHostedZone;
}

export class CloudFront extends BaseConstruct {
  public readonly distribution: Distribution;

  constructor(scope: Construct, ctx: Context, props: CloudFrontProps) {
    super(scope, ctx, props);

    this.distribution = new Distribution(this, this.id, {
      defaultBehavior: {
        origin: new S3StaticWebsiteOrigin(props.origin),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: 'index.html',
      domainNames: [props.domain],
      certificate: props.certificate,
    });
    this.out('DistributionId', this.distribution.distributionId);

    new ARecord(this, `${this.id}AliasRecord`, {
      zone: props.hostedZone,
      recordName: props.domain,
      target: RecordTarget.fromAlias(new CloudFrontTarget(this.distribution)),
    });
    this.out('Domain', this.distribution.domainName);
  }
}
