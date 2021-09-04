import { expect } from "chai";
import { concatItems } from "../src/functions/monthly-report/handler";

describe("#responseMessage", () => {
  it("Returns application/json response", () => {
    const res = concatItems({}, ["a", 1]);
    expect(res).to.eql({ a: 1 });
  });
});
