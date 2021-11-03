import convert from "./convert.js";
import fileLoader from "./fileLoader.js";
import fileWriter from "./fileWriter.js";

const convertLocal = (fileLoadLocation, requestedAttrs, ignoredElements) => {
  const files = fileLoader(fileLoadLocation);

  return files.map(([fileName, file]) => {
    return [fileName, convert(file, requestedAttrs, ignoredElements)];
  });
};

// SBL: "sbl",
// SBL: ["ID", "nodeId", "morphId", "Cat", "English"]
// SBL: []

// 1904-lowfat: "1904-lowfat"
// 1904-lowfat: ["role", "class", "n", "gloss", "strong"]
// 1904-lowfat: ["p"]
convertLocal(
  "1904-lowfat",
  ["role", "class", "n", "gloss", "strong"],
  ["p"]
).forEach((converted) => {
  const fileName = converted[0].replace("xml", "json");
  const fileData = JSON.stringify(converted[1], null, 2);
  console.log(fileName, Boolean(fileData));
  fileWriter(fileName, "1904-lowfat", fileData);
});
