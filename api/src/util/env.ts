const getEnvVar = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

export default {
  APP_NAME: getEnvVar('APP_NAME'),
  AWS_DEFAULT_REGION: getEnvVar('AWS_DEFAULT_REGION'),
  LINKS_STORAGE_BUCKET_NAME: getEnvVar('LINKS_STORAGE_BUCKET_NAME'),
  GOOGLE_CAPTCHA_SECRET_KEY: getEnvVar('GOOGLE_CAPTCHA_SECRET_KEY'),
  ALLOWED_ORIGINS: getEnvVar('ALLOWED_ORIGINS'),
};
