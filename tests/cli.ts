import { createReadStream } from "fs";
import { pipeline } from "stream/promises";
import { SizeExtractor } from "../lib/utils/sizeExtractor";
import probe from 'probe-image-size';

if (process.argv.length < 3) {
  console.error('Please provide an image path');
  process.exit(-1);
}

(async () => {
  for (const path of process.argv.slice(2)) {
    console.time(path);
    const rs = createReadStream(path); // { highWaterMark: 1 }
    const controller = new AbortController;
    let gotSize = false;
    await pipeline(
      rs,
      new SizeExtractor({ passthrough: false })
        .on('size', (data, type) => {
          console.log(`${data.width}x${data.height} (${type})`);
          gotSize = true;
        })
        .on('parseError', (err, type) => console.log(type, err))
        .on('parseAllDone', () => controller.abort())
        .on('data', () => { }),
      { signal: controller.signal },
    ).catch(err => {
      if (controller.signal.aborted)
        return;
      throw err;
    });
    console.timeEnd(path);
    console.time(path);
    const result = await probe(createReadStream(path));
    console.log(result);
    console.timeEnd(path);
  }
})();
