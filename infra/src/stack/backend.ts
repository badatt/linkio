import { Stack, StackProps, Duration, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Code, Runtime, IFunction } from 'aws-cdk-lib/aws-lambda';
import { ApiMapping, DomainName, HttpApi, HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { Bucket, BucketAccessControl, IBucket } from 'aws-cdk-lib/aws-s3';
import { Certificate, CertificateValidation, ICertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { ARecord, HostedZone, IHostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { ApiGatewayv2DomainProperties, CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';

import { Context } from '../context';
import { Distribution, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { S3StaticWebsiteOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';

type Props = StackProps & {
  cloudfrontCertificate: ICertificate;
};

export class BackendStack extends Stack {
  constructor(scope: Construct, id: string, ctx: Context, props: Props) {
    super(scope, id, props);

    const freeTierLinksStorageBucket = this.createFreeTierLinkStorageBucket(ctx);

    const apiFunction = this.createApiFunction(ctx);

    freeTierLinksStorageBucket.grantReadWrite(apiFunction);
    apiFunction.addEnvironment('FREE_TIER_BUCKET_NAME', freeTierLinksStorageBucket.bucketName);

    const hostedZone = HostedZone.fromHostedZoneAttributes(this, `${ctx.props.appName}HostedZone`, {
      hostedZoneId: ctx.props.hostedZoneId,
      zoneName: ctx.props.rootDomain,
    });

    const httpApi = this.createHttpApi(ctx, { handler: apiFunction });
    this.addCustomApiDomain(ctx, { httpApi, hostedZone });

    this.createAppCloudfrontDistribution(ctx, {
      hostedZone,
      certificate: props.cloudfrontCertificate,
      freeTierLinksStorageBucket: freeTierLinksStorageBucket,
    });
  }

  private createFreeTierLinkStorageBucket(ctx: Context): Bucket {
    const bucket = new Bucket(this, `${ctx.props.appName}FreeTierLinksStorageBucket`, {
      removalPolicy: ctx.isProd ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
      autoDeleteObjects: !ctx.isProd,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: '404.html',
      publicReadAccess: true,
      accessControl: BucketAccessControl.PUBLIC_READ,
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

  private addCustomApiDomain(ctx: Context, props: { httpApi: HttpApi; hostedZone: IHostedZone }) {
    const certificate = new Certificate(this, `${ctx.props.appName}ApiCert`, {
      domainName: ctx.props.apiDomain,
      validation: CertificateValidation.fromDns(props.hostedZone),
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
      zone: props.hostedZone,
      recordName: ctx.props.apiDomain,
      target: RecordTarget.fromAlias(
        new ApiGatewayv2DomainProperties(domainName.regionalDomainName, domainName.regionalHostedZoneId),
      ),
    });
  }

  private createAppDeploymentBucket(ctx: Context): Bucket {
    const bucket = new Bucket(this, `${ctx.props.appName}AppDeploymentBucket`, {
      removalPolicy: ctx.isProd ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: '404.html',
      publicReadAccess: true,
      accessControl: BucketAccessControl.PUBLIC_READ,
      autoDeleteObjects: !ctx.isProd,
    });
    ctx.out(this, 'AppDeploymentBucket', bucket.bucketArn);
    return bucket;
  }

  private createAppCloudfrontDistribution(
    ctx: Context,
    props: { hostedZone: IHostedZone; certificate: ICertificate; freeTierLinksStorageBucket: IBucket },
  ): Distribution {
    const distribution = new Distribution(this, `${ctx.props.appName}AppDistribution`, {
      defaultBehavior: {
        origin: new S3StaticWebsiteOrigin(this.createAppDeploymentBucket(ctx)),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: 'index.html',
      domainNames: [ctx.props.appDomain],
      certificate: props.certificate,
    });
    ctx.out(this, 'AppCloudfrontDistribution', distribution.distributionDomainName);

    distribution.addBehavior('/*', new S3StaticWebsiteOrigin(props.freeTierLinksStorageBucket));

    new ARecord(this, `${ctx.props.appName}AppAliasRecord`, {
      zone: props.hostedZone,
      recordName: ctx.props.appDomain,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
    });
    ctx.out(this, 'AppCustomDomain', distribution.domainName);

    return distribution;
  }
}
