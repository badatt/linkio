import { CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export interface Props {
  account: string;
  region: string;
  appName: string;
  domain: string;
}

export class Context {
  private static instance: Context;
  public props: Props;
  public isProd: boolean;

  private constructor() {
    this.props = {
      account: this.getEnvVar('AWS_ACCOUNT_ID'),
      region: this.getEnvVar('AWS_DEFAULT_REGION'),
      appName: this.getEnvVar('APP_NAME'),
      domain: this.getEnvVar('API_CUSTOM_DOMAIN'),
    };
    this.isProd = this.props.account === '849656214064';
  }

  public static getInstance(): Context {
    if (!Context.instance) {
      Context.instance = new Context();
    }
    return Context.instance;
  }

  private getEnvVar(name: string): string {
    const value = process.env[name];
    if (!value) {
      throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
  }

  public out(scope: Construct, name: string, value: string): void {
    new CfnOutput(scope, `${this.props.appName}${name}Out`, {
      value: value,
    });
  }
}
