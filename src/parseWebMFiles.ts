import fs from "fs";

export const parseWebMFiles = async (convertedFiles: string[]) => {
  const webMFileSizes = await Promise.all(
    convertedFiles.map((file) => fs.promises.stat(file))
  );
  const totalWebMFilesSize = webMFileSizes.reduce(
    (acc, cur) => acc + cur.size,
    0
  );
  return {
    totalWebMFilesSize,
  };
};
