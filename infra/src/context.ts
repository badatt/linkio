import { CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export interface Props {
  account: string;
  region: string;
  appName: string;
  apiDomain: string;
  apiCertArn: string;
  hostedZoneId: string;
}

export class Context {
  private static instance: Context;
  public readonly props: Props;
  public readonly isProd: boolean;
  public readonly rootDomain: string;

  private constructor() {
    this.props = {
      account: this.getEnvVar('AWS_ACCOUNT_ID'),
      region: this.getEnvVar('AWS_DEFAULT_REGION'),
      appName: this.getEnvVar('APP_NAME'),
      apiDomain: this.getEnvVar('API_CUSTOM_DOMAIN'),
      apiCertArn: this.getEnvVar('AWS_API_CERTIFICATE_ARN'),
      hostedZoneId: this.getEnvVar('AWS_HOSTED_ZONE_ID'),
    };
    this.isProd = this.props.account === '849656214064';
    this.rootDomain = this.getRootDomain();
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

  private getRootDomain(): string {
    const domainParts = this.props.apiDomain.split('.');
    if (domainParts.length < 2) {
      throw new Error(`Invalid domain name: ${this.props.apiDomain}`);
    }
    return domainParts.slice(1).join('.');
  }
}
