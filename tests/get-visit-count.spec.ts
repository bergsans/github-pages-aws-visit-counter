import sinon from "sinon";
import * as api from "../src/libs/utils";
import { APIGatewayProxyEvent } from "aws-lambda";
import { expect } from "chai";
import {
  joinLn,
  format,
  getVisitCount,
} from "../src/functions/get-visit-count/handler";

describe("#joinLn", () => {
  it("Format line", () => {
    const res = joinLn(["url1", "1"]);
    expect(res).to.equal("url1\t--\t1\n");
  });
});

describe("#format", () => {
  it("Format accurately", () => {
    const res = format(JSON.stringify({ url1: 3 }));
    expect(res).to.equal("url1\t--\t3\n");
  });
});

describe("#getVisitCount", () => {
  beforeEach(() => {
    sinon.stub(api, "dbGet").returns(
      Promise.resolve({
        Item: {
          id: "count",
          archive: JSON.stringify({ url1: 2, url2: 1 }),
          total: 1,
          thisMonth: JSON.stringify({
            url0: 1,
          }),
        },
      })
    );
  });
  afterEach(() => sinon.restore());
  it("Returns application/json response", async () => {
    const res = await getVisitCount({} as APIGatewayProxyEvent);
    const expectedResponse = `

THIS MONTH
==========
url0\t--\t1


ALL TIME
==========
url1\t--\t2
url2\t--\t1


TOTAL
==========
1
  `;
    expect(res.body).to.equal(expectedResponse);
  });
});
