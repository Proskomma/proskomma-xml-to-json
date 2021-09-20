import * as fs from "fs";

const fileWriter = (fileName, dataToWrite) => {
  const prefix = `./output`;
  fs.writeFileSync(`${prefix}/${fileName}`, dataToWrite);
};

export default fileWriter;
