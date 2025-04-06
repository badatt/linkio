import { Stack, StackProps } from 'aws-cdk-lib';
import { Context } from '../context';
import { Construct } from 'constructs';
import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';

export class CertStack extends Stack {
  constructor(scope: Construct, id: string, ctx: Context, props?: StackProps) {
    super(scope, id, props);

    const cert = new Certificate(this, `${ctx.props.appName}ApiCert`, {
      domainName: ctx.props.domain,
      validation: CertificateValidation.fromDns(),
    });

    ctx.out(this, 'ApiCert', cert.certificateArn);
  }
}
