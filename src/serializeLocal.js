import { serializeMany } from "./serialize.js";

import fileLoader from "./fileLoader.js";
import fileWriter from "./fileWriter.js";

const serializeLocal = async (
  fileLoadLocation,
  requestedAttrs,
  elementsToIgnore
) => {
  console.log("Loading files...");
  const files = fileLoader(fileLoadLocation);
  console.log("Done.");

  console.log("Serialize many...");
  const manySerialized = await serializeMany(
    files,
    requestedAttrs,
    elementsToIgnore
  );
  console.log("Done.");

  return manySerialized;
};

(async () => {
  const serialized = await serializeLocal(
    "1904-lowfat",
    ["role", "class", "n", "gloss", "strong"],
    ["p"]
  );

  serialized.forEach((serialized) => {
    const bookNumber = serialized[0].split("-")[0];
    const fileName = `${bookNumber}.json`;
    const fileData = JSON.stringify(serialized[1]);
    console.log(`Writing ${fileName}...`);
    fileWriter(fileName, "1904-lowfat", fileData);
  });
  console.log("Write Complete.");
})();
