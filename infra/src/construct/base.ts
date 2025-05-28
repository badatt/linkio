import { Construct } from 'constructs';
import { CfnOutput } from 'aws-cdk-lib';

import { Context } from '../context';
import { BaseProps } from '../types';

export class BaseConstruct extends Construct {
  protected readonly ctx: Context;
  protected readonly scope: Construct;
  protected readonly id: string;

  constructor(scope: Construct, ctx: Context, props: BaseProps) {
    super(scope, props.id);
    this.scope = scope;
    this.ctx = ctx;
    this.id = `${ctx.props.appName}${props.id}`;
  }

  protected out(name: string, value: string): void {
    new CfnOutput(this.scope, `${this.id}${name}Out`, {
      value: value,
    });
  }
}
