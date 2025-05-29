import { Construct } from 'constructs';
import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { ApiMapping, HttpApi, HttpMethod, DomainName } from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { ARecord, IHostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';
import { ApiGatewayv2DomainProperties } from 'aws-cdk-lib/aws-route53-targets';

import { BaseProps } from '../types';
import { BaseConstruct } from './base';
import { Context } from '../context';

interface ApiProps extends BaseProps {
  handler: IFunction;
}

export class Api extends BaseConstruct {
  public readonly httpApi: HttpApi;

  constructor(scope: Construct, ctx: Context, props: ApiProps) {
    super(scope, ctx, props);

    this.httpApi = new HttpApi(this, this.id, {
      apiName: this.id,
    });

    const lambdaIntegration = new HttpLambdaIntegration(`${this.id}LambdaIntegration`, props.handler);

    this.httpApi.addRoutes({
      path: '/{proxy+}',
      methods: [HttpMethod.ANY],
      integration: lambdaIntegration,
    });

    this.out('Endpoint', this.httpApi.apiEndpoint);
  }

  public addCustomApiDomain(props: { domain: string; hostedZone: IHostedZone }) {
    const certificate = new Certificate(this, `${this.id}Cert`, {
      domainName: props.domain,
      validation: CertificateValidation.fromDns(props.hostedZone),
    });

    const domainName = new DomainName(this, `${this.id}Domain`, {
      domainName: props.domain,
      certificate: certificate,
    });
    this.out('Domain', domainName.name);

    new ApiMapping(this, `${this.id}Mapping`, {
      api: this.httpApi,
      domainName: domainName,
      stage: this.httpApi.defaultStage,
    });

    new ARecord(this, `${this.id}AliasRecord`, {
      zone: props.hostedZone,
      recordName: props.domain,
      target: RecordTarget.fromAlias(
        new ApiGatewayv2DomainProperties(domainName.regionalDomainName, domainName.regionalHostedZoneId),
      ),
    });
  }
}
