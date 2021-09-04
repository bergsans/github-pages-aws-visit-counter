import { APIGatewayProxyResult } from "aws-lambda";
import { getVisits, putItem, DynamoDBItem } from "../../libs/utils";

interface Visits {
  [k: string]: number;
}

export const concatItems = (
  acc: Visits,
  [url, count]: [string, number]
): Visits =>
  url in acc ? { ...acc, [url]: acc[url] + count } : { ...acc, [url]: count };

export async function monthlyReport(): Promise<APIGatewayProxyResult> {
  const response: DynamoDBItem = await getVisits();
  const visits: Visits = JSON.parse(response.Item.thisMonth);
  const archive: Visits = JSON.parse(response.Item.archive);
  const visitsArr: [string, number][] = Object.entries(visits);
  const archiveArr: [string, number][] = Object.entries(archive);
  const newArchive: Visits = [...visitsArr, ...archiveArr].reduce(
    concatItems,
    {}
  );
  const newItem = {
    Item: {
      id: "count",
      thisMonth: JSON.stringify({}),
      total: response.Item.total,
      archive: JSON.stringify(newArchive),
    },
  };
  const result = await putItem(newItem);
  return result;
}
