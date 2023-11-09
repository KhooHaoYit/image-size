import imageSize from "image-size";
import { SizeExtractor } from "../lib/utils/sizeExtractor";
import { finished, pipeline } from "stream/promises";
import { createReadStream } from "fs";
import { readdir, stat } from "fs/promises";

type Options =
  | { path: string }
  | { buffer: Buffer }

export async function getImageSizeResult(data: Options) {
  try {
    return imageSize('path' in data ? data.path : data.buffer);
  } catch { }
}

export async function getStreamBasedResult(data: Options) {
  const controller = new AbortController;
  const extractor = new SizeExtractor({ passthrough: false });
  if ('path' in data)
    await pipeline(
      createReadStream(data.path),
      extractor
        .once('parseAllDone', () => controller.abort()),
      { signal: controller.signal },
    ).catch(err => {
      if (controller.signal.aborted)
        return;
      throw err;
    });
  else {
    extractor.end(data.buffer);
    await finished(extractor);
  }
  return extractor;
}

export async function* listFiles(path: string): AsyncGenerator<string, void, void> {
  const fileStat = await stat(path);
  if (fileStat.isFile())
    return yield path;
  for (const file of await readdir(path))
    yield* listFiles(path + '/' + file);
}
