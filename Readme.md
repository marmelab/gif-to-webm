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
```

## Usage

```bash
npm run dev -- -f <source_folder>
```

Example

```bash
npm run dev -- -f ../react-admin
```

## Options

```
Options:
  -f, --folder <path>              source folder
  -e, --exclude-pattern <pattern>  exclude pattern from source folder search (separate multiple patterns with comma) (default: "node_modules/**")
  -p, --pattern <pattern>          doc files pattern (default: "**/*.md")
  -t, --template <path>            template file holding the WebM player html code (default: "./template.html")
  -q, --quality <number>           output quality, ranges between 0-63, lower means better quality (default: "40")
  -d, --delete-gif-files           set this flag to delete the original GIF files after conversion (default: false)
  -h, --help                       display help for command
```

More complex example:

```bash
npm run dev -- -f ../react-admin-v4 -e "node_modules/**,docs/_site/**,packages/**" -p "docs/*.md"
```

## Customizing the WebM Player

You can customize the WebM player by providing your own template file in `./template.html`.

## License

Licensed under the [MIT License](https://github.com/marmelab/react-admin/blob/master/LICENSE.md), provided with ❤️ by [marmelab](https://marmelab.com).

