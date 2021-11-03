import * as fs from "fs";

const fileLoader = (dataDirectory) => {
  const relativePath = `./data/${dataDirectory}`;
  const fileNames = fs.readdirSync(relativePath);
  return fileNames.map((fileName) => {
    return [
      fileName,
      fs.readFileSync(`${relativePath}/${fileName}`).toString(),
    ];
  });
};

export default fileLoader;
