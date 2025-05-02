import { CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export interface Props {
  account: string;
  region: string;
  appName: string;
  rootDomain: string;
  hostedZoneId: string;
  apiDomain: string;
  appDomain: string;
}

export class Context {
  private static instance: Context;
  public readonly props: Props;
  public readonly isProd: boolean;

  private constructor() {
    this.props = {
      account: this.getEnvVar('AWS_ACCOUNT_ID'),
      region: this.getEnvVar('AWS_DEFAULT_REGION'),
      appName: this.getEnvVar('APP_NAME'),
      rootDomain: this.getEnvVar('ROOT_DOMAIN'),
      hostedZoneId: this.getEnvVar('AWS_HOSTED_ZONE_ID'),
      apiDomain: `go-api.${this.getEnvVar('ROOT_DOMAIN')}`,
      appDomain: `go.${this.getEnvVar('ROOT_DOMAIN')}`,
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
