import { Stack, StackProps, Duration, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Code, Runtime, IFunction } from 'aws-cdk-lib/aws-lambda';
import { ApiMapping, DomainName, HttpApi, HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';
import { ARecord, HostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { ApiGatewayv2DomainProperties } from 'aws-cdk-lib/aws-route53-targets';

import { Context } from '../context';

export class BackendStack extends Stack {
  constructor(scope: Construct, id: string, ctx: Context, props?: StackProps) {
    super(scope, id, props);

    const freeTierLinksStorageBucket = this.createFreeTierLinkStorageBucket(ctx);

    const apiFunction = this.createApiFunction(ctx);

    freeTierLinksStorageBucket.grantReadWrite(apiFunction);
    apiFunction.addEnvironment('FREE_TIER_BUCKET_NAME', freeTierLinksStorageBucket.bucketName);

    const httpApi = this.createHttpApi(ctx, { handler: apiFunction });
    this.addCustomApiDomain(ctx, { httpApi });
  }

  private createFreeTierLinkStorageBucket(ctx: Context): Bucket {
    const bucket = new Bucket(this, `${ctx.props.appName}FreeTierLinksStorageBucket`, {
      removalPolicy: ctx.isProd ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
      autoDeleteObjects: !ctx.isProd,
      lifecycleRules: [
        {
          expiration: Duration.days(28),
        },
      ],
    });
    ctx.out(this, 'FreeTierLinksStorageBucket', bucket.bucketArn);
    return bucket;
  }

  private createApiFunction(ctx: Context): NodejsFunction {
    const fun = new NodejsFunction(this, `${ctx.props.appName}ApiFunction`, {
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
    ctx.out(this, 'ApiFunction', fun.functionArn);
    return fun;
  }

  private createHttpApi(ctx: Context, props: { handler: IFunction }): HttpApi {
    const httpApi = new HttpApi(this, `${ctx.props.appName}Api`, {
      apiName: `${ctx.props.appName}Api`,
    });

    const lambdaIntegration = new HttpLambdaIntegration(`${ctx.props.appName}LambdaIntegration`, props.handler);

    httpApi.addRoutes({
      path: '/{proxy+}',
      methods: [HttpMethod.ANY],
      integration: lambdaIntegration,
    });

    ctx.out(this, 'HttpApiEndpoint', httpApi.apiEndpoint);
    return httpApi;
  }

  private addCustomApiDomain(ctx: Context, props: { httpApi: HttpApi }) {
    const hostedZone = HostedZone.fromHostedZoneAttributes(this, `${ctx.props.appName}HostedZone`, {
      hostedZoneId: ctx.props.hostedZoneId,
      zoneName: ctx.props.rootDomain,
    });

    const certificate = new Certificate(this, `${ctx.props.appName}ApiCert`, {
      domainName: ctx.props.apiDomain,
      validation: CertificateValidation.fromDns(hostedZone),
    });

    const domainName = new DomainName(this, `${ctx.props.appName}ApiDomain`, {
      domainName: ctx.props.apiDomain,
      certificate: certificate,
    });
    ctx.out(this, 'ApiDomain', domainName.name);

    new ApiMapping(this, `${ctx.props.appName}ApiMapping`, {
      api: props.httpApi,
      domainName: domainName,
      stage: props.httpApi.defaultStage,
    });

    new ARecord(this, `${ctx.props.appName}ApiAliasRecord`, {
      zone: hostedZone,
      recordName: ctx.props.apiDomain,
      target: RecordTarget.fromAlias(
        new ApiGatewayv2DomainProperties(domainName.regionalDomainName, domainName.regionalHostedZoneId),
      ),
    });
  }
}
