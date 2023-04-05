import { glob } from "glob";
import { ReplaceInFileConfig, replaceInFile } from "replace-in-file";
import fs from "fs";

export const getRegExp = (gifFileName: string) =>
  `!\\[[^\\[]+\\]\\((\\S+${gifFileName?.replace(".", "\\.")})\\)`;

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
  const from = gifFileNames
    .filter(Boolean)
    .map((gifFileName) => RegExp(getRegExp(gifFileName!), "g"));
  const to = gifFileNames
    .filter(Boolean)
    .map((gifFileName) => (match: string) => {
      const previousLink = match.match(RegExp(getRegExp(gifFileName!)))?.[1];
      return templateAsString.replace(
        "%webm_file%",
        `${previousLink?.split(".").slice(0, -1).join(".")}.webm`
      );
    });
  const options: ReplaceInFileConfig = {
    files: docFiles,
    from,
    to,
  };
  return replaceInFile(options).then((results) =>
    results.filter((file) => file.hasChanged).map((file) => file.file)
  );
};
