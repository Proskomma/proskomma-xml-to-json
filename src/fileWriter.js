import * as fs from "fs";

const fileWriter = (fileName, subDir, dataToWrite) => {
  const prefix = `./output/${subDir}`;
  fs.writeFileSync(`${prefix}/${fileName}`, dataToWrite);
};

export default fileWriter;
