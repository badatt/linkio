const getEnvVar = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

export default {
  APP_NAME: getEnvVar('AppName'),
  IS_LOCAL_ENV: process.env['AppIsLocalEnv'],
  AWS_DEFAULT_REGION: getEnvVar('AWS_DEFAULT_REGION'),
  LINKS_STORAGE_BUCKET_NAME: getEnvVar('LinksStorageBucketName'),
  ALLOWED_ORIGINS: getEnvVar('AllowedOrigins'),
  LINKS_TABLE: getEnvVar('LinksTable'),
  USERS_TABLE: getEnvVar('UsersTable'),
  FIREBASE_PROJECT_ID: getEnvVar('FirebaseProjectId'),
  FIREBASE_CLIENT_EMAIL: getEnvVar('FirebaseClientEmail'),
  FIREBASE_PRIVATE_KEY: getEnvVar('FirebasePrivateKey'),
  RECAPTCHA_SECRET_KEY: getEnvVar('GoogleRecaptchaSecretKey'),
};
