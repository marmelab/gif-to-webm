# gif-to-webm

CLI tool to convert GIF files to WebM.

This aims to reduce the carbon footprint of a repository.

This tool also supports replacing the GIF files integration in Markdown files by a WebM html player.

## Pre-requisites

- node
- ffmpeg

## Installation

```bash
make install
make install-cli
```

## Usage

```bash
gif-to-webm -f <source_folder>
```

Example

```bash
gif-to-webm -f ../react-admin
```

## Options

```
Options:
  -f, --folder <path>              source folder
  -e, --exclude-pattern <pattern>  exclude pattern from source folder search (separate multiple patterns with comma) (default: "node_modules/**")
  -p, --pattern <pattern>          doc files pattern (default: "**/*.md")
  -t, --template <path>            template file holding the WebM player html code (default: "./template.html")
  -q, --quality <number>           output quality, ranges between 0-63, lower means better quality (default: "18")
  -c, --skip-gif-conversion        set this flag to skip the conversion of GIF files to WebM (default: false)
  -r, --skip-doc-replace           set this flag to skip the doc search and replace step (default: false)
  -d, --delete-gif-files           set this flag to delete the original GIF files after conversion (default: false)
  --max-fps <number>               maximum FPS (default: "15")
  --max-width <number>             maximum video width (default: "1920")
  --max-height <number>            maximum video height (default: "1080")
  -h, --help                       display help for command
```

More complex example:

```bash
gif-to-webm -f ../react-admin-v4 -e "node_modules/**,docs/_site/**,packages/**" -p "docs/*.md"
```

## Customizing the WebM Player

You can customize the WebM player by providing your own template file in `./template.html`.

## Development

Use the following command to run the CLI without building it:

```bash
npm run dev -- <args>
```

Example:

```bash
npm run dev -- -f ../react-admin-v4 -e "node_modules/**,docs/_site/**,packages/**" -p "docs/*.md"
```

## License

Licensed under the [MIT License](https://github.com/marmelab/react-admin/blob/master/LICENSE.md), provided with ❤️ by [marmelab](https://marmelab.com).

