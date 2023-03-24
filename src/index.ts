import sourceMapSupport from "source-map-support";
import { program } from "commander";
import { parseGifFiles } from "./parseGifFiles";
import { humanFileSize } from "./humanFileSize";
import { convertGifFilesToWebM } from "./convertGifToWebM";
import { parseWebMFiles } from "./parseWebMFiles";
import { replaceLinks } from "./replaceLinks";

sourceMapSupport.install();

program
  .description(
    "Convert GIF files to WebM and replace links to them in doc files"
  )
  .requiredOption("-f, --folder <path>", "source folder")
  .option(
    "-e, --exclude-pattern <pattern>",
    "exclude pattern from source folder search (separate multiple patterns with comma)",
    "node_modules/**"
  )
  .option("-p, --pattern <pattern>", "doc files pattern", "**/*.md")
  .option(
    "-t, --template <path>",
    "template file holding the WebM player html code",
    `${__dirname}/../template.html`
  )
  .option(
    "-q, --quality <number>",
    "output quality, ranges between 0-63, lower means better quality",
    "40"
  )
  .action(async (options) => {
    const { folder, excludePattern, pattern, template, quality } = options;
    console.log(`folder: ${folder}`);
    console.log(`excludePattern: ${excludePattern}`);
    console.log(`pattern: ${pattern}`);
    console.log(`template: ${template}`);
    console.log(`quality: ${quality}`);

    const { gifFiles, totalGifFilesSize } = await parseGifFiles(
      folder,
      excludePattern
    );
    console.info(`Found ${gifFiles.length} GIF files`);
    console.info(`Total GIF files size: ${humanFileSize(totalGifFilesSize)}`);

    const convertedFiles = await convertGifFilesToWebM(
      folder,
      gifFiles.slice(0, 1),
      quality
    );
    console.info(`Successfully converted ${convertedFiles.length} files`);

    const { totalWebMFilesSize } = await parseWebMFiles(convertedFiles);
    console.info(`Total WebM files size: ${humanFileSize(totalWebMFilesSize)}`);

    const replacedFiles = await replaceLinks(
      folder,
      pattern,
      template,
      gifFiles.slice(0, 1)
    );
    console.info(`Successfully edited ${replacedFiles.length} doc files`);
  });

program.parse();
