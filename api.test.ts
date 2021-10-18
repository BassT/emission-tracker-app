import { extractIdOfCreatedObject } from "./api";

describe("extractIdOfCreatedObject", () => {
  it("should work correctly", () => {
    const id = "e40da3bb-d93c-455d-90a4-11ab8ac0ddc4";
    const location = `http://localhost:3000/api/transport-activity/${id}`;
    expect(extractIdOfCreatedObject(location)).toBe(id);
  });
});
