import * as fs from "fs";
import ffmpeg from "js-ffmpeg";
import chalk from "chalk";

const convertSingleGifFileToWebM = (gifFile: string, quality: number) => {
  console.info(chalk.dim(`converting file '${gifFile}'...`));
  const folder = gifFile.split("/").slice(0, -1).join("/");
  const fileName = gifFile.split("/").pop()?.split(".").slice(0, -1).join(".");
  return new Promise<string>((resolve, reject) => {
    ffmpeg
      .ffmpeg(
        gifFile,
        ["-c", "vp9", "-b:v", "0", "-crf", `${quality}`],
        `${folder}/${fileName}.webm`
      )
      // @ts-ignore
      .success(() => resolve(`${folder}/${fileName}.webm`))
      .error(function (error: any) {
        console.error(
          chalk.red(`ffmpeg error while processing '${gifFile}'`),
          error
        );
        reject(error);
      });
  });
};

export const convertGifFilesToWebM = async (
  sourceFolder: string,
  gifFiles: string[],
  quality: string
) => {
  const parsedQuality = parseInt(quality) || 40;
  // It seems better to process the files one at a time because otherwise
  // the ffmpeg processes are very resource intensive and can freeze the host.
  const webmFiles: string[] = [];
  for (const file of gifFiles) {
    const webmFile = await convertSingleGifFileToWebM(
      `${sourceFolder}/${file}`,
      parsedQuality
    );
    webmFiles.push(webmFile);
  }
  return webmFiles;
};
