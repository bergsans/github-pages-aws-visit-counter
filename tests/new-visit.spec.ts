import { APIGatewayProxyEvent } from "aws-lambda";
import { expect } from "chai";
import {
  GITHUB_PAGES_URL,
  isValidRequest,
} from "../src/functions/new-visit/handler";

describe("#isValidRequest", () => {
  it("Returns false when invalid request", () => {
    const res = isValidRequest(({
      queryStringParameters: { url: "https://www.bilbo.shire" },
    } as unknown) as APIGatewayProxyEvent);
    expect(res).to.be.false;
  });
  it("Returns true when valid request", () => {
    const res = isValidRequest(({
      queryStringParameters: { url: GITHUB_PAGES_URL },
    } as unknown) as APIGatewayProxyEvent);
    expect(res).to.be.true;
  });
});
