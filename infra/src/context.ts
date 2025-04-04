export interface Props {
    account: string;
    region: string;
    appName: string;
}

export class Context {
    private static instance: Context;
    public props: Props;

    private constructor() {
        this.props = {
            account: this.getEnvVar('AWS_ACCOUNT_ID'),
            region: this.getEnvVar('AWS_DEFAULT_REGION'),
            appName: this.getEnvVar('APP_NAME'),
        };
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
}