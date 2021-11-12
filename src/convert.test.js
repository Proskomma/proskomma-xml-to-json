import { Validator } from "jsonschema";
import { readFileSync } from "fs";
import convert from "./convert.js";

describe("data conversion", () => {
  describe("lowfat data conversion", () => {
    it("handles james without crashing", async () => {
      const lowfatJames = readFileSync(
        "./data/1904-lowfat/20-james.xml"
      ).toString();
      const converted = await convert(
        lowfatJames,
        ["role", "class", "strong", "gloss"],
        ["p"],
        "book"
      );
    });

    it("handles John 1:1", async () => {
      const lowfatJames = readFileSync(
        "./data/1904-lowfat/04-john.xml"
      ).toString();
      const converted = await convert(
        lowfatJames,
        ["role", "class", "strong", "gloss"],
        ["p"],
        "book"
      );
    });

    it("handles Matthew 1:1", async () => {
      const lowfatMatthew = readFileSync(
        "./data/1904-lowfat/01-matthew.xml"
      ).toString();
      const converted = await convert(
        lowfatMatthew,
        ["role", "class", "strong", "gloss", "text"],
        ["p"],
        "book"
      );

      const firstWord =
        converted.children[0].children[0].children[0].children[0].children[0];

      expect(firstWord).toEqual({
        content: {
          elementType: "w",
          text: "Βίβλος",
          class: "noun",
          strong: "976",
          gloss: "[The] book",
        },
        children: [],
      });
    });
  });

  describe("specific output cases", () => {
    it("converts one parent node with two children", async () => {
      const testXml = `<Bible type="Translation" name="The Mike Standard Version">
        <Testament type="Old">
          Old Words
        </Testament>
        <Testament type="New">
          New Words
      </Testament>
      </Bible>`;

      const converted = await convert(testXml, ["name", "type"], [], "Bible");

      expect(converted).toEqual({
        content: {
          elementType: "Bible",
          type: "Translation",
          name: "The Mike Standard Version",
        },
        children: [
          {
            content: {
              elementType: "Testament",
              type: "Old",
              text: "Old Words",
            },

            children: [],
          },
          {
            content: {
              elementType: "Testament",
              type: "New",
              text: "New Words",
            },

            children: [],
          },
        ],
      });
    });

    it("converts one parent node with two children, each with 2 grandchildren", async () => {
      const testXml = `<Bible type="Translation" name="The Mike Standard Version">
        <Testament type="Old">
          <Book type="Narrative" name="Genesis">In the beginning...</Book>
          <Book type="Wisdom" name="Ecclesiastes">All is vapor...</Book>
        </Testament>
        <Testament type="New">
          <Book type="Gospel" name="Matthew">Blessed are the meek...</Book>
          <Book type="Epistle" name="James">All is joy...</Book>
      </Testament>
      </Bible>`;

      const converted = await convert(testXml, ["name", "type"], [], "Bible");

      expect(converted).toEqual({
        content: {
          elementType: "Bible",
          type: "Translation",
          name: "The Mike Standard Version",
        },
        children: [
          {
            content: {
              elementType: "Testament",
              type: "Old",
            },
            children: [
              {
                content: {
                  elementType: "Book",
                  name: "Genesis",
                  text: "In the beginning...",
                  type: "Narrative",
                },
                children: [],
              },
              {
                content: {
                  elementType: "Book",
                  name: "Ecclesiastes",
                  text: "All is vapor...",
                  type: "Wisdom",
                },
                children: [],
              },
            ],
          },
          {
            content: {
              elementType: "Testament",
              type: "New",
            },
            children: [
              {
                content: {
                  elementType: "Book",
                  name: "Matthew",
                  text: "Blessed are the meek...",
                  type: "Gospel",
                },
                children: [],
              },
              {
                content: {
                  elementType: "Book",
                  name: "James",
                  text: "All is joy...",
                  type: "Epistle",
                },
                children: [],
              },
            ],
          },
        ],
      });
    });
  });

  describe("json schema validation", () => {
    const pkTreeSchema = JSON.parse(
      readFileSync("./data/pk-tree.schema.json").toString()
    );

    it("validates converter output against json schema", async () => {
      const testXml = `<Bible type="Translation" name="The Mike Standard Version">
  <Testament type="Old">
  <Book type="Narrative" name="Genesis">In the beginning...</Book>
  <Book type="Wisdom" name="Ecclesiastes">All is vapor...</Book>
  </Testament>
  <Testament type="New">
  <Book type="Gospel" name="Matthew">Blessed are the meek...</Book>
  <Book type="Epistle" name="James">All is joy...</Book>
  </Testament>
  </Bible>`;

      const converted = await convert(testXml, ["name", "type"], [], "Bible");

      const jsonSchemaValidator = new Validator();
      const validation = jsonSchemaValidator.validate(converted, pkTreeSchema);

      expect(validation.errors.length).toBe(0);
    });

    it("validates test data (genealogy) against json schema", () => {
      const genealogy = JSON.parse(
        readFileSync("./data/genealogy.json").toString()
      );

      const jsonSchemaValidator = new Validator();
      const validation = jsonSchemaValidator.validate(genealogy, pkTreeSchema);
      expect(validation.errors.length).toBe(0);
    });

    it("validates test data (jude.sbl.json) against json schema", () => {
      const genealogy = JSON.parse(
        readFileSync("./output/sbl/jude.sbl.json").toString()
      );

      const jsonSchemaValidator = new Validator();
      const validation = jsonSchemaValidator.validate(genealogy, pkTreeSchema);
      expect(validation.errors.length).toBe(0);
    });

    it("validates test data (1john.sbl.json) against json schema", () => {
      const genealogy = JSON.parse(
        readFileSync("./output/sbl/1john.sbl.json").toString()
      );

      const jsonSchemaValidator = new Validator();
      const validation = jsonSchemaValidator.validate(genealogy, pkTreeSchema);
      expect(validation.errors.length).toBe(0);
    });

    it("validates test data (luke.sbl.json) against json schema", () => {
      const genealogy = JSON.parse(
        readFileSync("./output/sbl/luke.sbl.json").toString()
      );

      const jsonSchemaValidator = new Validator();
      const validation = jsonSchemaValidator.validate(genealogy, pkTreeSchema);
      expect(validation.errors.length).toBe(0);
    });

    it("validates test data (1904 lowfat john) against json schema", () => {
      const john = JSON.parse(
        readFileSync("./output/1904-lowfat/04-john.json").toString()
      );

      const jsonSchemaValidator = new Validator();
      const validation = jsonSchemaValidator.validate(john, pkTreeSchema);
      expect(validation.errors.length).toBe(0);
    });
  });
});
