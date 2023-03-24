import sourceMapSupport from "source-map-support";
import { program } from "commander";

sourceMapSupport.install();

program
  .description(
    "Convert GIF files to WebM and replace links to them in doc files"
  )
  .option("-f, --folder <path>", "source folder")
  .option("-p, --pattern <pattern>", "doc files pattern")
  .option(
    "-t, --template <path>",
    "template file holding the WebM player html code",
    `${__dirname}/../template.html`
  )
  .action((options) => {
    const { folder, pattern, template } = options;
    console.info(`folder: ${folder}`);
    console.info(`pattern: ${pattern}`);
    console.info(`template: ${template}`);
  });

program.parse();
