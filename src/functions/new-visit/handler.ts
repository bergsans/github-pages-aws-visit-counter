import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  responseMessage,
  getVisits,
  putItem,
  DynamoDBItem,
} from "../../libs/utils";

export const GITHUB_PAGES_URL = "https://bergsans.github.io";

export const isValidRequest = (event: APIGatewayProxyEvent): boolean =>
  event?.queryStringParameters?.url &&
  event.queryStringParameters.url.startsWith(GITHUB_PAGES_URL);

export async function newVisit(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  if (!isValidRequest(event)) {
    return responseMessage(400, "Invalid request.");
  }
  const { url } = event.queryStringParameters;
  const response = await getVisits();
  const visits = JSON.parse(response.Item.thisMonth);
  const newVisits = {
    ...visits,
    [url]: url in visits ? parseInt(visits[url], 10) + 1 : 1,
  };
  const newItem: DynamoDBItem = {
    Item: {
      id: "count",
      thisMonth: JSON.stringify(newVisits),
      total: response.Item.total + 1,
      archive: response.Item.archive,
    },
  };
  const result = await putItem(newItem);
  return result;
}
