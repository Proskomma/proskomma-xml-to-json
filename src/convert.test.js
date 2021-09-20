import convert from "./convert.js";

describe("data converter", () => {
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
            },
            {
              content: {
                elementType: "Testament",
                type: "New",
                text: "New Words",
              },
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
                },
                {
                  content: {
                    elementType: "Book",
                    name: "Ecclesiastes",
                    text: "All is vapor...",
                    type: "Wisdom",
                  },
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
                },
                {
                  content: {
                    elementType: "Book",
                    name: "James",
                    text: "All is joy...",
                    type: "Epistle",
                  },
                },
              ],
            },
          ],
        },
      ],
    });
  });
});
