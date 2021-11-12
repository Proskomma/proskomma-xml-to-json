import convert from "./convert.js";
import fileLoader from "./fileLoader.js";
import fileWriter from "./fileWriter.js";

const convertLocal = async (
  fileLoadLocation,
  requestedAttrs,
  ignoredElements,
  rootNode,
) => {
  const files = fileLoader(fileLoadLocation);

  const convertedFiles = [];

  for (const file of files) {
    const fileName = file[0].replace("xml", "json");
    const fileData = await convert(file[1], requestedAttrs, ignoredElements, rootNode);

    console.log(fileName, Boolean(fileData), "writing file...");
    fileWriter(fileName, "1904-lowfat", JSON.stringify(fileData, null, 2));
  }
};

// SBL: "sbl",
// SBL: ["ID", "nodeId", "morphId", "Cat", "English"]
// SBL: []

// 1904-lowfat: "1904-lowfat"
// 1904-lowfat: ["role", "class", "n", "gloss", "strong"]
// 1904-lowfat: ["p"]
(async () => {
  await convertLocal(
    "1904-lowfat",
    ["role", "class", "n", "gloss", "strong"],
    ["p"],
    "book",
  );
})();
