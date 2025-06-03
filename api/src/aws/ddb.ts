/* eslint-disable @typescript-eslint/no-explicit-any */
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand, PutCommand, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

import env from '../util/env.js';
import { ApiError } from '../model/error.js';

const client = DynamoDBDocumentClient.from(
  new DynamoDBClient({
    region: env.AWS_DEFAULT_REGION,
  }),
);

const exists = async (tableName: string, uid: string): Promise<boolean> => {
  const command = new GetCommand({
    TableName: tableName,
    Key: { uid },
  });

  try {
    const response = await client.send(command);
    return !!response.Item;
  } catch (error: any) {
    throw new ApiError(404, `Get item failed: ${error.message}`);
  }
};

const create = async <T>(tableName: string, item: T): Promise<T> => {
  const command = new PutCommand({
    TableName: tableName,
    Item: item as Record<string, any>,
    ConditionExpression: 'attribute_not_exists(uid)',
  });

  try {
    await client.send(command);
    return item;
  } catch (error: any) {
    throw new ApiError(406, `Put item failed: ${error.message}`);
  }
};

const get = async <T>(tableName: string, uid: string): Promise<T | undefined> => {
  const command = new GetCommand({
    TableName: tableName,
    Key: { uid },
  });

  try {
    const response = await client.send(command);
    return response.Item as T | undefined;
  } catch (error: any) {
    throw new ApiError(404, `Get item failed: ${error.message}`);
  }
};

const query = async <T>(tableName: string, condition: string, values: Record<string, any>): Promise<Array<T>> => {
  const command = new QueryCommand({
    TableName: tableName,
    KeyConditionExpression: condition,
    ExpressionAttributeValues: values,
  });

  try {
    const response = await client.send(command);
    const items = new Array<T>();
    if (response.Items && response.Items.length > 0) {
      for (const item of response.Items) {
        items.push(item as T);
      }
      return items;
    } else {
      return [];
    }
  } catch (error: any) {
    throw new ApiError(404, `Query items failed: ${error.message}`);
  }
};

const update = async <T>(tableName: string, uid: string, updates: Record<string, any>): Promise<T> => {
  const updateExpressionParts: string[] = [];
  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, any> = {};

  Object.entries(updates).forEach(([key, value]) => {
    const attrName = `#${key}`;
    const attrValue = `:${key}`;
    updateExpressionParts.push(`${attrName} = ${attrValue}`);
    expressionAttributeNames[attrName] = key;
    expressionAttributeValues[attrValue] = value;
  });

  const updateExpression = 'SET ' + updateExpressionParts.join(', ');

  const command = new UpdateCommand({
    TableName: tableName,
    Key: { uid },
    UpdateExpression: updateExpression,
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
    ReturnValues: 'ALL_NEW',
    ConditionExpression: 'attribute_exists(uid)',
  });

  try {
    const response = await client.send(command);
    if (!response.Attributes) throw new ApiError(406, 'Update item failed: unknown error');
    return response.Attributes as T;
  } catch (error: any) {
    throw new ApiError(406, `Update item failed: ${error.message}`);
  }
};

export default {
  create,
  exists,
  get,
  query,
  update,
};
