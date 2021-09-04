import { APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { promisify } from "util";

export const db = new DynamoDB.DocumentClient();
export const dbPut = promisify(db.put).bind(db);
export const dbGet = promisify(db.get).bind(db);

interface Item {
  id?: string;
  thisMonth: string;
  total: number;
  archive: string;
}

export interface DynamoDBItem {
  Key?: { id: string };
  Item: Item;
}

export const initialDBValue: DynamoDBItem = {
  Item: {
    thisMonth: "{}",
    total: 0,
    archive: "{}",
  },
};

export function responseMessage(
  statusCode: number,
  msg: string,
  contentType = "application/json"
): APIGatewayProxyResult {
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET",
      "Content-Type": contentType,
    },
    body:
      contentType !== "application/json" ? msg : JSON.stringify(msg, null, 2),
  };
}

export async function getVisits() {
  try {
    const response = await dbGet({
      TableName: "GithubPagesCountVisitsTable",
      Key: {
        id: "count",
      },
    });
    return !response ||
      !Object.values(response).length ||
      !response.Item.thisMonth
      ? initialDBValue
      : response;
  } catch (e) {
    console.log(e);
    return initialDBValue;
  }
}

export async function putItem(item: DynamoDBItem) {
  try {
    await dbPut({
      TableName: "GithubPagesCountVisitsTable",
      ...item,
    });
    return responseMessage(200, "ok.");
  } catch (e) {
    console.log(e);
    return responseMessage(400, "Error when adding visit.");
  }
}
