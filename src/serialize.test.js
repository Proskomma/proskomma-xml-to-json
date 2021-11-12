import { Proskomma } from "proskomma";

import fileLoader from "./fileLoader.js";
import { serialize, serializeMany } from "./serialize.js";

describe("data serialization", () => {
  it("handles single file", async () => {
    const files = fileLoader("1904-lowfat");

    const serialized = await serialize(
      files[0][0],
      files[0][1],
      ["role", "class", "n", "gloss", "strong"],
      ["p"],
      "book"
    );

    expect(serialized).toBeTruthy();

    const pk = new Proskomma();

    pk.loadSuccinctDocSet(serialized);
  });

  it("handles multiple files", async () => {
    const files = fileLoader("1904-lowfat");

    const serialized = await serializeMany(
      files,
      ["role", "class", "n", "gloss", "strong"],
      ["p"],
      "book"
    );

    expect(serialized.length).toBe(27);
  });
});
