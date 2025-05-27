import { Construct } from 'constructs';
import { Context } from '../context';
import { BaseConstruct } from './base';
import { BaseProps } from '../types';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Code, IFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Duration } from 'aws-cdk-lib';
import { ApiMapping, HttpApi, HttpMethod, DomainName } from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { ARecord, IHostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';
import { ApiGatewayv2DomainProperties } from 'aws-cdk-lib/aws-route53-targets';

export class Api extends BaseConstruct {
  public readonly apiFunction: IFunction;
  public readonly httpApi: HttpApi;

  constructor(scope: Construct, ctx: Context, props: BaseProps) {
    super(scope, ctx, props);

    this.apiFunction = this.createApiFunction();

    this.httpApi = new HttpApi(this, this.id, {
      apiName: this.id,
    });

    const lambdaIntegration = new HttpLambdaIntegration(`${this.id}LambdaIntegration`, this.apiFunction);

    this.httpApi.addRoutes({
      path: '/{proxy+}',
      methods: [HttpMethod.ANY],
      integration: lambdaIntegration,
    });

    this.out('Endpoint', this.httpApi.apiEndpoint);
  }

  private createApiFunction(): NodejsFunction {
    const fun = new NodejsFunction(this, `${this.id}Function`, {
      code: Code.fromInline(`
  exports.handler = async (event, context) => {
    console.log('Event:', JSON.stringify(event, null, 2));
    console.log('Context:', JSON.stringify(context, null, 2));
  
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Hello from Lambda (ESM)!' })
    };
  };
        `),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_22_X,
      timeout: Duration.seconds(30),
      logRetention: 30,
    });
    this.out('Function', fun.functionArn);
    return fun;
  }

  public addEnv(key: string, value: string) {
    if (this.apiFunction instanceof NodejsFunction) {
      this.apiFunction.addEnvironment(key, value);
    } else {
      throw new Error('API function is not a NodejsFunction');
    }
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
