import * as fs from "fs";
import ffmpeg from "fluent-ffmpeg";

const convertSingleGifFileToWebM = (gifFile: string, quality: number) => {
  console.info(`converting file '${gifFile}'...`);
  const readStream = fs.createReadStream(gifFile);
  const folder = gifFile.split("/").slice(0, -1).join("/");
  const fileName = gifFile.split("/").pop()?.split(".").slice(0, -1).join(".");
  var writeStream = fs.createWriteStream(`${folder}/${fileName}.webm`);
  return new Promise<string>((resolve, reject) => {
    ffmpeg()
      .input(readStream)
      .videoCodec("libvpx-vp9")
      .format("webm")
      .outputOptions("-b:v 0")
      .outputOptions("-crf 40")
      .on("end", () => {
        resolve(`${folder}/${fileName}.webm`);
      })
      .on("error", (err: any) => {
        console.error("ffmpeg error", err);
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
  const webmFiles = await Promise.all(
    gifFiles.map((file) =>
      convertSingleGifFileToWebM(`${sourceFolder}/${file}`, parsedQuality)
    )
  );
  return webmFiles;
};
