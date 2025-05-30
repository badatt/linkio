/* eslint-disable @typescript-eslint/no-explicit-any */
import { DynamoDBClient, PutItemCommand, GetItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

import env from '../util/env.js';

const client = new DynamoDBClient({
  region: env.AWS_DEFAULT_REGION,
});

const put = async (tableName: string, item: object) => {
  const command = new PutItemCommand({
    TableName: tableName,
    Item: marshall(item),
  });

  try {
    await client.send(command);
  } catch (error: any) {
    throw new Error(`Put item failed: ${error.message}`);
  }
};

const get = async (tableName: string, uid: string): Promise<object> => {
  const command = new GetItemCommand({
    TableName: tableName,
    Key: marshall({ uid }),
  });

  try {
    const response = await client.send(command);
    if (response.Item) {
      const item = unmarshall(response.Item);
      return item;
    } else {
      return {};
    }
  } catch (error: any) {
    throw new Error(`Get item failed: ${error.message}`);
  }
};

const query = async (tableName: string, condition: string, values: Record<string, string>): Promise<Array<object>> => {
  const command = new QueryCommand({
    TableName: tableName,
    KeyConditionExpression: condition,
    ExpressionAttributeValues: marshall(values),
  });

  try {
    const response = await client.send(command);
    const items = new Array<object>();
    if (response.Items && response.Items.length > 0) {
      for (const item of response.Items) {
        items.push(unmarshall(item));
      }
      return items;
    } else {
      return [];
    }
  } catch (error: any) {
    throw new Error(`Query items failed: ${error.message}`);
  }
};

export default {
  get,
  query,
  put,
};
