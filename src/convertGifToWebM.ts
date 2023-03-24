import * as fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import chalk from "chalk";

const convertSingleGifFileToWebM = (gifFile: string, quality: number) => {
  console.info(chalk.dim(`converting file '${gifFile}'...`));
  const readStream = fs.createReadStream(gifFile);
  const folder = gifFile.split("/").slice(0, -1).join("/");
  const fileName = gifFile.split("/").pop()?.split(".").slice(0, -1).join(".");
  var writeStream = fs.createWriteStream(`${folder}/${fileName}.webm`);
  return new Promise<string>((resolve, reject) => {
    ffmpeg()
      .input(readStream)
      .inputFormat("gif_pipe")
      .videoCodec("libvpx-vp9")
      .format("webm")
      .outputOptions("-b:v 0")
      .outputOptions(`-crf ${quality}`)
      .on("end", () => {
        resolve(`${folder}/${fileName}.webm`);
      })
      .on("error", (err: any) => {
        console.error(
          chalk.red(`ffmpeg error while processing '${gifFile}'`),
          err
        );
        reject(err);
      })
      .pipe(writeStream);
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
