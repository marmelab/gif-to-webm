import sourceMapSupport from "source-map-support";
import { program } from "commander";
import { parseGifFiles } from "./parseGifFiles";
import { humanFileSize } from "./humanFileSize";

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
  .option("-p, --pattern <pattern>", "doc files pattern")
  .option(
    "-t, --template <path>",
    "template file holding the WebM player html code",
    `${__dirname}/../template.html`
  )
  .action(async (options) => {
    const { folder, excludePattern, pattern, template } = options;
    console.log(`folder: ${folder}`);
    console.log(`excludePattern: ${excludePattern}`);
    console.log(`pattern: ${pattern}`);
    console.log(`template: ${template}`);

    const { gifFiles, totalGifFilesSize } = await parseGifFiles(
      folder,
      excludePattern
    );
    gifFiles.forEach((file) => console.log(file));
    console.info(`Found ${gifFiles.length} GIF files`);
    console.info(`Total GIF files size: ${humanFileSize(totalGifFilesSize)}`);
  });

program.parse();
