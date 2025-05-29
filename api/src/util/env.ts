const getEnvVar = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

export default {
  APP_NAME: getEnvVar('AppName'),
  AWS_DEFAULT_REGION: getEnvVar('AWS_DEFAULT_REGION'),
  LINKS_STORAGE_BUCKET_NAME: getEnvVar('LinksStorageBucketName'),
  ALLOWED_ORIGINS: getEnvVar('AllowedOrigins'),
  LINKS_TABLE: getEnvVar('LinksTable'),
  USERS_TABLE: getEnvVar('UsersTable'),
};
