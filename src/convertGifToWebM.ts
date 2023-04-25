import ffmpeg from "js-ffmpeg";
import chalk from "chalk";

const convertSingleGifFileToWebM = (
  gifFile: string,
  { quality, maxFps, maxWidth, maxHeight }: ParsedQualityOptions
) => {
  console.info(chalk.dim(`converting file '${gifFile}'...`));
  const folder = gifFile.split("/").slice(0, -1).join("/");
  const fileName = gifFile.split("/").pop()?.split(".").slice(0, -1).join(".");
  return new Promise<string>((resolve, reject) => {
    ffmpeg
      .ffprobe(gifFile)
      // @ts-ignore
      .success((json) => {
        let fps: string | undefined =
          json.streams[0]?.r_frame_rate?.split("/")[0];
        const parsedFps = fps && parseInt(fps);
        const targetFps = parsedFps && parsedFps < maxFps ? parsedFps : maxFps;

        ffmpeg
          .ffmpeg(
            gifFile,
            [
              "-c",
              "vp9",
              "-b:v",
              "0",
              "-crf",
              `${quality}`,
              "-pass",
              "1",
              "-an",
              "-f",
              "null",
            ],
            "/dev/null"
          )
          // @ts-ignore
          .success(() => {
            ffmpeg
              .ffmpeg(
                gifFile,
                [
                  "-c",
                  "vp9",
                  "-b:v",
                  "0",
                  "-crf",
                  `${quality}`,
                  "-pass",
                  "2",
                  "-an",
                  "-vf",
                  `scale='min(${maxWidth},iw)':min'(${maxHeight},ih)':force_original_aspect_ratio=decrease,fps=${targetFps}`,
                ],
                `${folder}/${fileName}.webm`
              )
              // @ts-ignore
              .success(() => resolve(`${folder}/${fileName}.webm`))
              .error((error: any) => {
                console.error(
                  chalk.red(
                    `ffmpeg error while processing '${gifFile}' - pass 2`
                  ),
                  error
                );
                reject(error);
              });
          })
          .error((error: any) => {
            console.error(
              chalk.red(`ffmpeg error while processing '${gifFile}' - pass 1`),
              error
            );
            reject(error);
          });
      })
      .error((error: any) => {
        console.error(
          chalk.red(`ffmpeg error while probing '${gifFile}' with ffprobe`),
          error
        );
        reject(error);
      });
  });
};

interface ParsedQualityOptions {
  quality: number;
  maxFps: number;
  maxWidth: number;
  maxHeight: number;
}

export const convertGifFilesToWebM = async (
  sourceFolder: string,
  gifFiles: string[],
  { quality, maxFps, maxWidth, maxHeight }: QualityOptions
) => {
  const parsedQuality = (quality && parseInt(quality)) || 18;
  const parsedMaxFps = (maxFps && parseInt(maxFps)) || 15;
  const parsedMaxWidth = (maxWidth && parseInt(maxWidth)) || 1920;
  const parsedMaxHeight = (maxHeight && parseInt(maxHeight)) || 1080;
  // It seems better to process the files one at a time because otherwise
  // the ffmpeg processes are very resource intensive and can freeze the host.
  const webmFiles: string[] = [];
  for (const file of gifFiles) {
    const webmFile = await convertSingleGifFileToWebM(
      `${sourceFolder}/${file}`,
      {
        quality: parsedQuality,
        maxFps: parsedMaxFps,
        maxWidth: parsedMaxWidth,
        maxHeight: parsedMaxHeight,
      }
    );
    webmFiles.push(webmFile);
  }
  return webmFiles;
};

interface QualityOptions {
  quality?: string;
  maxFps?: string;
  maxWidth?: string;
  maxHeight?: string;
}
