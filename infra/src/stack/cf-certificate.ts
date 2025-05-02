import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Context } from '../context';
import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';
import { HostedZone } from 'aws-cdk-lib/aws-route53';

export class CloudfrontCertificateStack extends Stack {
  public readonly certificate: Certificate;

  constructor(scope: Construct, id: string, ctx: Context, props?: StackProps) {
    super(scope, id, props);
    this.certificate = new Certificate(this, `${ctx.props.appName}CloudfrontCertificate`, {
      domainName: ctx.props.appDomain,
      subjectAlternativeNames: [ctx.props.apiDomain],
      validation: CertificateValidation.fromDns(
        HostedZone.fromHostedZoneAttributes(this, `${ctx.props.appName}HostedZone`, {
          hostedZoneId: ctx.props.hostedZoneId,
          zoneName: ctx.props.rootDomain,
        }),
      ),
    });
    ctx.out(this, 'CloudfrontCertificateArn', this.certificate.certificateArn);
  }
}
