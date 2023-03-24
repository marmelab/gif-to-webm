import fs from "fs";
import { glob } from "glob";

export const parseGifFiles = async (
  sourceFolder: string,
  excludePattern: string
) => {
  const gifFiles = await glob("**/*.{gif,GIF}", {
    ignore: excludePattern?.split(","),
    cwd: sourceFolder,
  });
  const gifFileSizes = await Promise.all(
    gifFiles.map((file) => fs.promises.stat(`${sourceFolder}/${file}`))
  );
  const totalGifFilesSize = gifFileSizes.reduce(
    (acc, cur) => acc + cur.size,
    0
  );
  return {
    gifFiles,
    totalGifFilesSize,
  };
};
