import fs from "fs";
import chalk from "chalk";

const deleteFile = (path: string) => {
  return new Promise((resolve, reject) => {
    console.info(chalk.dim(`removing file '${path}'...`));
    fs.rm(path, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(path);
      }
    });
  });
};

export const deleteGifFiles = async (
  sourceFolder: string,
  gifFiles: string[]
) => {
  return await Promise.all(
    gifFiles.map((file) => deleteFile(`${sourceFolder}/${file}`))
  );
};
