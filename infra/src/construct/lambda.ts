import { Construct } from 'constructs';
import { Code, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Duration } from 'aws-cdk-lib';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

import { Context } from '../context';
import { BaseProps } from '../types';
import { BaseConstruct } from './base';

export class Lambda extends BaseConstruct {
  public readonly handler: NodejsFunction;

  constructor(scope: Construct, ctx: Context, props: BaseProps) {
    super(scope, ctx, props);

    this.handler = this.createFunction({
      name: 'Handler',
    });
  }

  private createFunction(props: { name: string }): NodejsFunction {
    const fun = new NodejsFunction(this, `${this.id}${props.name}`, {
      code: Code.fromInline(`
    exports.handler = async (event, context) => {
      console.log('Event:', JSON.stringify(event, null, 2));
      console.log('Context:', JSON.stringify(context, null, 2));
    
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Hello from Lambda !' })
      };
    };
          `),
      handler: 'index.handler',
      runtime: Runtime.NODEJS_22_X,
      timeout: Duration.seconds(30),
      logRetention: 30,
    });
    this.out(props.name, fun.functionArn);
    return fun;
  }

  public addEnv(key: string, value: string) {
    this.handler.addEnvironment(key, value);
  }
}
