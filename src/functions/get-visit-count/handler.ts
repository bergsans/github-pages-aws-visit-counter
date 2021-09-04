import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { responseMessage, getVisits } from "../../libs/utils";

export const joinLn = ([k, v]: [string, string]): string => `${k}\t--\t${v}\n`;

export const format = (data: string): string =>
  Object.entries(JSON.parse(data)).map(joinLn).join("");

export async function getVisitCount(
  _e: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const response = await getVisits();
  const thisMonth = format(response.Item.thisMonth);
  const allTime = format(response.Item.archive);
  const body = `

THIS MONTH
==========
${thisMonth}

ALL TIME
==========
${allTime}

TOTAL
==========
${response.Item.total}
  `;
  return "Item" in response
    ? responseMessage(200, body, "text/plain; charset=utf-8")
    : responseMessage(400, "Cannot get results");
}
