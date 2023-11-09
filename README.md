# @khoohaoyit/image-size

> A stream based image size extractor in [Node](https://nodejs.org)

Features:
- Support variaty of formats
- Low memory footprint
- API compatible with [image-size](https://github.com/image-size/image-size)
- Fine control over when to stop parsing
- No dependancy

## Installation
```sh
npm install @khoohaoyit/image-size
```

## Usage

### Processing buffer
```ts
import { SizeExtractor } from "@khoohaoyit/image-size";
import { finished } from 'stream/promises';

const extractor = new SizeExtractor({ passthrough: false });
await finished(
  extractor
    .end(buffer)
);
console.log(extractor.imageSize); // Compatable with `image-size`
```

### Extract image size while writing to a file
```ts
import { SizeExtractor } from "@khoohaoyit/image-size";
import { pipeline } from 'stream/promises';
import { createWriteStream } from 'fs';

const extractor = new SizeExtractor({ passthrough: true });
await pipeline(
  await fetch('https://github.githubassets.com/assets/gc_banner_dark-b73fa80c5473.png')
    .then(res => res.body),
  extractor,
  createWriteStream('imageA.png'),
);
console.log(extractor.sizes);
```

### Stop processing once it has done parsing all formats
```ts
import { SizeExtractor } from "@khoohaoyit/image-size";
import { pipeline } from 'stream/promises';
import { createReadStream } from 'fs';

const extractor = new SizeExtractor({ passthrough: false });
const controller = new AbortController;
await pipeline(
  createReadStream('imageA.png'),
  extractor
    .once('parseAllDone', () => controller.abort()),
  { signal: controller.signal },
).catch(err => {
  if (controller.signal.aborted)
    return;
  throw err;
});
console.log(extractor.sizes);
```

## Library Comparison
|  | [@khoohaoyit/image-size](https://github.com/KhooHaoYit/image-size.git) | [probe-image-size](https://github.com/nodeca/probe-image-size) | [image-size](https://github.com/image-size/image-size) |
| :-: | :-: | :-: | :-: |
| Stream based | Yes | Yes | No |
| Support sync | No | Yes | Yes |
| `dds`  | Yes | No | Yes |
| `icns` | Yes | No | Yes |
| `j2c`  | Yes | No | Yes |
| `jp2`  | Yes | No | Yes |
| `ktx`  | Yes | No | Yes |
| `pnm`  | Yes | No | Yes |
| `tga`  | Yes | No | Yes |
| `avif` | No | Yes | No |
| `heic` | No | Yes | No |
| `heif` | No | Yes | No |

The listed library on top all supports `ico`, `cur`, `bmp`, `gif`, `jpg`, `png`, `psd`, `svg`, `tiff`, and `webp`

## Documentation

### `new SizeExtractor(options)`
- `options.passthrough: boolean`
  - Passes the input to output if `true`
- `options.whitelistFormats?: string[]`
  - Whitelist specific formats
- `options.blacklistFormats?: string[]`
  - Blacklist specific formats, ignored if `whitelistFormats` is set

### `SizeExtractor.imageSize`

The API compatible of [image-size](https://github.com/image-size/image-size) result

### `SizeExtractor.sizes`

The extracted sizes emitted from `'size'`

### Event: `'size'`
- `data: { width: number, height: number }`
- `format: string`

Emitted when a format has successfully extracted the image size

### Event: `'parseError'`
- `error: unknown`
- `format: string`

Emitted when a format encountered unexpected error while parsing

### Event: `'parseDone'`
- `format: string`

Emitted when a format has ended parsing

### Event: `'parseAllDone'`

Emitted when all formats has ended parsing
