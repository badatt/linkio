import { Stack, StackProps, Duration, RemovalPolicy } from 'aws-cdk-lib';
import { Context } from '../context';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Code, Runtime } from 'aws-cdk-lib/aws-lambda';
import { HttpApi, HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { Bucket } from 'aws-cdk-lib/aws-s3';

export class BackendStack extends Stack {
  constructor(scope: Construct, id: string, ctx: Context, props?: StackProps) {
    super(scope, id, props);

    const freeTierLinksStorageBucket = this.createFreeTierLinkStorageBucket(ctx);
    const apiFunction = this.createApiFunction(ctx);
    freeTierLinksStorageBucket.grantReadWrite(apiFunction);
    apiFunction.addEnvironment('FREE_TIER_BUCKET_NAME', freeTierLinksStorageBucket.bucketName);

    const httpApi = new HttpApi(this, `${ctx.props.appName}Api`, {
      apiName: `${ctx.props.appName}Api`,
    });

    const lambdaIntegration = new HttpLambdaIntegration(`${ctx.props.appName}LambdaIntegration`, apiFunction);

    httpApi.addRoutes({
      path: '/{proxy+}',
      methods: [HttpMethod.ANY],
      integration: lambdaIntegration,
    });

    ctx.out(this, 'ApiEndpoint', httpApi.apiEndpoint);
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
}
