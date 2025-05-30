import { Construct } from 'constructs';
import { Attribute, AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { RemovalPolicy } from 'aws-cdk-lib';
import { IGrantable } from 'aws-cdk-lib/aws-iam';

import { BaseConstruct } from './base';
import { Context } from '../context';
import { BaseProps } from '../types';

export class DynamoDb extends BaseConstruct {
  public readonly tables: Map<string, Table> = new Map();

  constructor(scope: Construct, ctx: Context, props: BaseProps) {
    super(scope, ctx, props);

    this.createTable({
      tableName: 'UsersTable',
      partitionKey: {
        name: 'uid',
        type: AttributeType.STRING,
      },
    });

    /* usersTable.addGlobalSecondaryIndex({
      indexName: 'EmailIndex',
      partitionKey: { name: 'email', type: AttributeType.STRING },
      projectionType: ProjectionType.KEYS_ONLY,
    }); */

    this.createTable({
      tableName: 'LinksTable',
      partitionKey: {
        name: 'uid',
        type: AttributeType.STRING,
      },
    });

    /* linksTable.addGlobalSecondaryIndex({
      indexName: 'CreatedByUidIndex',
      partitionKey: { name: 'createdByUid', type: AttributeType.STRING },
      sortKey: { name: 'createdAt', type: AttributeType.NUMBER },
      projectionType: ProjectionType.INCLUDE,
      nonKeyAttributes: ['active'],
    }); */

    /* linksTable.addGlobalSecondaryIndex({
      indexName: 'CreatedByEmailIndex',
      partitionKey: { name: 'createdByEmail', type: AttributeType.STRING },
      sortKey: { name: 'createdAt', type: AttributeType.NUMBER },
      projectionType: ProjectionType.INCLUDE,
      nonKeyAttributes: ['active'],
    }); */
  }

  private createTable(props: { tableName: string; partitionKey: Attribute; sortKey?: Attribute }): Table {
    const table = new Table(this, `${this.id}${props.tableName}`, {
      partitionKey: props.partitionKey,
      sortKey: props.sortKey,
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: this.ctx.isProd ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
    });
    this.out(props.tableName, table.tableName);
    this.tables.set(props.tableName, table);
    return table;
  }

  public grandReadAndWriteAccess(identity: IGrantable) {
    this.tables.forEach((table) => {
      table.grantReadWriteData(identity);
    });
  }
}
