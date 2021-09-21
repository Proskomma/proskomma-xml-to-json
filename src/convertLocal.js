import convert from "./convert.js";
import fileLoader from "./fileLoader.js";
import fileWriter from "./fileWriter.js";

const convertLocal = (fileLoadLocation, requestedAttrs) => {
  const files = fileLoader(fileLoadLocation);

  return files.map((file) => {
    return ["testFile.json", convert(file, requestedAttrs)];
  });
};

convertLocal("sbl", ["ID", "nodeId", "morphId", "Cat", "English"]).forEach(
  (converted) => {
    const fileName = converted[0];
    const fileData = JSON.stringify(converted[1], null, 2);
    fileWriter(fileName, fileData);
  }
);
