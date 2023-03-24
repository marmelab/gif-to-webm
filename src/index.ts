import sourceMapSupport from "source-map-support";
import { program } from "commander";
import chalk from "chalk";
import { parseGifFiles } from "./parseGifFiles";
import { humanFileSize } from "./humanFileSize";
import { convertGifFilesToWebM } from "./convertGifToWebM";
import { parseWebMFiles } from "./parseWebMFiles";
import { replaceLinks } from "./replaceLinks";
import { deleteGifFiles } from "./deleteGifFiles";

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
    console.log(chalk.dim("Parsed options:"));
    console.log(chalk.dim(`folder: ${folder}`));
    console.log(chalk.dim(`excludePattern: ${excludePattern}`));
    console.log(chalk.dim(`pattern: ${pattern}`));
    console.log(chalk.dim(`template: ${template}`));
    console.log(chalk.dim(`quality: ${quality}`));
    console.log();

    try {
      const { gifFiles, totalGifFilesSize } = await parseGifFiles(
        folder,
        excludePattern
      );
      console.info(`Found ${chalk.bold(gifFiles.length)} GIF files`);
      console.info(
        `Total GIF files size: ${chalk.bold(
          chalk.yellow(humanFileSize(totalGifFilesSize))
        )}`
      );

      const convertedFiles = await convertGifFilesToWebM(
        folder,
        gifFiles,
        quality
      );
      console.info(
        chalk.green(
          `Successfully converted ${chalk.bold(convertedFiles.length)} files`
        )
      );

      const { totalWebMFilesSize } = await parseWebMFiles(convertedFiles);
      console.info(
        `Total WebM files size: ${chalk.bold(
          chalk.blue(humanFileSize(totalWebMFilesSize))
        )}`
      );
      console.info(
        `Reduced assets size by ${chalk.bold(
          chalk.green(
            `${(
              Math.round(
                ((totalGifFilesSize - totalWebMFilesSize) / totalGifFilesSize) *
                  10000
              ) / 100
            ).toFixed(2)} %`
          )
        )}!`
      );

      const replacedFiles = await replaceLinks(
        folder,
        pattern,
        template,
        gifFiles
      );
      console.info(
        chalk.green(
          `Successfully edited ${chalk.bold(replacedFiles.length)} doc files`
        )
      );

      const removedFiles = await deleteGifFiles(folder, gifFiles);
      console.info(
        chalk.green(
          `Successfully deleted ${chalk.bold(removedFiles.length)} GIF files`
        )
      );
    } catch (error) {
      console.error(chalk.red((error as Error)?.message));
      process.exit(1);
    }
  });

program.parse();
