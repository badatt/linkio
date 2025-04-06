import { S3Client, HeadObjectCommand, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { nanoid } from 'nanoid';
import env from '../util/env.js';

const s3 = new S3Client({
  region: env.AWS_DEFAULT_REGION,
});

const checkIfObjectExists = async (bucket: string, key: string): Promise<boolean> => {
  try {
    const command = new HeadObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    await s3.send(command);
    return true;
  } catch (err: any) {
    if (err.name === 'NotFound') {
      return false;
    }
    throw err;
  }
};

const uploadFreeTierLinkObject = async (link: string): Promise<string> => {
  const bucketName = env.FREE_TIER_BUCKET_NAME;
  let exists;
  let key;

  do {
    key = nanoid(6);
    exists = await checkIfObjectExists(bucketName, key);
  } while (exists);

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Metadata: {
      'x-amz-website-redirect-location': link,
    },
  });

  try {
    await s3.send(command);
    return key;
  } catch (error: any) {
    console.error('❌ Upload failed:', error);
    throw new Error(`Upload failed: ${error.message}`);
  }
};

const getFreeTierLinkObject = async (key: string): Promise<string> => {
  const bucketName = env.FREE_TIER_BUCKET_NAME;
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  try {
    const response = await s3.send(command);
    return response.Metadata?.['x-amz-website-redirect-location'] ?? '';
  } catch (error: any) {
    console.error('❌ Get failed:', error);
    throw new Error(`Get failed: ${error.message}`);
  }
};

export { uploadFreeTierLinkObject, getFreeTierLinkObject };
