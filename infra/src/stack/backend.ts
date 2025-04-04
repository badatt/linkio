import { Stack, StackProps, Duration, CfnOutput } from 'aws-cdk-lib';
import { Context } from '../context';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Code , Runtime} from 'aws-cdk-lib/aws-lambda';
import { HttpApi, HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';

export class BackendStack extends Stack {
  constructor(scope: Construct, id: string, ctx: Context, props?: StackProps) {
    super(scope, id, props);

    const apiFunction = new NodejsFunction(this, `${ctx.props.appName}ApiFunction`, {
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
      handler: 'lambda.handler',
      runtime: Runtime.NODEJS_22_X,
      timeout: Duration.seconds(30),
    });

    const httpApi = new HttpApi(this, `${ctx.props.appName}Api`, {
      apiName: `${ctx.props.appName}Api`,
    });

    httpApi.addRoutes({
      path: '/api/{proxy+}',
      methods: [HttpMethod.ANY],
      integration: new HttpLambdaIntegration(`${ctx.props.appName}LambdaIntegration`, apiFunction),
    });

    new CfnOutput(this, `${ctx.props.appName}ApiEndpoint`, {
      value: httpApi.apiEndpoint,
    });
  }
}
