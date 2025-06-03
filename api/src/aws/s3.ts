/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  S3Client,
  HeadObjectCommand,
  PutObjectCommand,
  GetObjectCommand,
  GetObjectCommandOutput,
} from '@aws-sdk/client-s3';

import env from '../util/env.js';
import { ApiError } from '../model/error.js';

const client = new S3Client({
  region: env.AWS_DEFAULT_REGION,
});

const checkIfObjectExists = async (bucket: string, key: string): Promise<boolean> => {
  try {
    const command = new HeadObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    await client.send(command);
    return true;
  } catch (err: any) {
    if (err.name === 'NotFound') {
      return false;
    }
    throw err;
  }
};

const putLinkObject = async (bucket: string, key: string, link: URL): Promise<void> => {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    WebsiteRedirectLocation: link.href,
    ContentType: 'text/html',
    Tagging: 'link=true',
  });

  try {
    await client.send(command);
  } catch (error: any) {
    throw new ApiError(406, `Upload link object failed: ${error.message}`);
  }
};

const getObject = async (bucket: string, key: string): Promise<GetObjectCommandOutput> => {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  try {
    return await client.send(command);
  } catch (error: any) {
    throw new ApiError(404, `Get failed: ${error.message}`);
  }
};

export default { putLinkObject, getObject, checkIfObjectExists };
