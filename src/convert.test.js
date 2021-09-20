import { Validator } from "jsonschema";
import { readFileSync } from "fs";
import convert from "./convert.js";

describe("data conversion", () => {
  describe("specific output cases", () => {
    it("converts one parent node with two children", () => {
      const testXml = `<Bible type="Translation" name="The Mike Standard Version">
        <Testament type="Old">
          Old Words
        </Testament>
        <Testament type="New">
          New Words
      </Testament>
      </Bible>`;

      const converted = convert(testXml, ["name", "type"]);

      expect(converted).toEqual({
        data: [
          {
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
          },
        ],
      });
    });

    it("converts one parent node with two children, each with 2 grandchildren", () => {
      const testXml = `<Bible type="Translation" name="The Mike Standard Version">
        <Testament type="Old">
          <Book type="Narrative", name="Genesis">In the beginning...</Book>
          <Book type="Wisdom", name="Ecclesiastes">All is vapor...</Book>
        </Testament>
        <Testament type="New">
          <Book type="Gospel" name="Matthew">Blessed are the meek...</Book>
          <Book type="Epistle" name="James">All is joy...</Book>
      </Testament>
      </Bible>`;

      const converted = convert(testXml, ["name", "type"]);

      expect(converted).toEqual({
        data: [
          {
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
          },
        ],
      });
    });
  });

  describe("json schema validation", () => {
    const pkTreeSchema = JSON.parse(
      readFileSync("./data/pk-tree.schema.json").toString()
    );

    it("validates against json schema", () => {
      const testXml = `<Bible type="Translation" name="The Mike Standard Version">
  <Testament type="Old">
  <Book type="Narrative", name="Genesis">In the beginning...</Book>
  <Book type="Wisdom", name="Ecclesiastes">All is vapor...</Book>
  </Testament>
  <Testament type="New">
  <Book type="Gospel" name="Matthew">Blessed are the meek...</Book>
  <Book type="Epistle" name="James">All is joy...</Book>
  </Testament>
  </Bible>`;

      const converted = convert(testXml, ["name", "type"]);
      //console.log(JSON.stringify(converted, null, 2));

      var jsonSchemaValidator = new Validator();
      const validation = jsonSchemaValidator.validate(converted, pkTreeSchema);
      //console.log(validation);
      expect(validation.errors.length).toBe(0);
    });
  });
});
