import { glob } from "glob";
import { ReplaceInFileConfig, replaceInFile } from "replace-in-file";
import fs from "fs";

const findDocFiles = async (sourceFolder: string, pattern: string) => {
  return (
    await glob(pattern, {
      cwd: sourceFolder,
    })
  ).map((file) => `${sourceFolder}/${file}`);
};

export const replaceLinks = async (
  sourceFolder: string,
  pattern: string,
  template: string,
  gifFiles: string[]
) => {
  const docFiles = await findDocFiles(sourceFolder, pattern);
  const gifFileNames = gifFiles.map((file) => file.split("/").pop());
  const templateAsString = fs.readFileSync(template, "utf8");
  const promises = gifFileNames.filter(Boolean).map((gifFileName) => {
    const options: ReplaceInFileConfig = {
      files: docFiles,
      from: RegExp(`!\\[.+\\]\\(.+${gifFileName?.replace(".", "\\.")}\\)`, "g"),
      to: (match) => {
        const previousLink = match.match(
          RegExp(`!\\[.+\\]\\((.+${gifFileName?.replace(".", "\\.")})\\)`)
        )?.[1];
        return templateAsString.replace(
          "%webm_file%",
          `${previousLink?.split(".").slice(0, -1).join(".")}.webm`
        );
      },
    };
    return replaceInFile(options).then((results) =>
      results.filter((file) => file.hasChanged).map((file) => file.file)
    );
  });
  return (await Promise.all(promises)).reduce(
    (acc, cur) => cur.reduce((a, c) => (a.includes(c) ? a : [...a, c]), acc),
    []
  );
};
