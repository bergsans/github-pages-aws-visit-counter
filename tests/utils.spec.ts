import sinon from "sinon";
import { expect } from "chai";
import { getVisits, responseMessage } from "../src/libs/utils";
import * as api from "../src/libs/utils";

describe("#getVisits", () => {
  beforeEach(() => {
    sinon.stub(api, "dbGet").returns(
      Promise.resolve({
        Item: {
          id: "count",
          archive: "{}",
          total: 1,
          thisMonth: {
            url: 1,
          },
        },
      })
    );
  });
  afterEach(() => sinon.restore());
  it("Should succeed", async () => {
    const res = await getVisits();
    expect(res).to.eql({
      Item: {
        id: "count",
        archive: "{}",
        total: 1,
        thisMonth: { url: 1 },
      },
    });
  });
});

describe("#responseMessage", () => {
  it("Returns application/json response", () => {
    const res = JSON.stringify(responseMessage(200, "ok"));
    expect(res).to.equal(
      JSON.stringify({
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Methods": "GET",
          "Content-Type": "application/json",
        },
        body: '"ok"',
      })
    );
  });

  it("Returns text/plain response", () => {
    const multiLnTxt = `1
2
3`;
    const res = JSON.stringify(
      responseMessage(200, multiLnTxt, "text/plain; charset=utf-8")
    );
    expect(res).to.equal(
      JSON.stringify({
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
          "Access-Control-Allow-Methods": "GET",
          "Content-Type": "text/plain; charset=utf-8",
        },
        body: "1\n2\n3",
      })
    );
  });
});
