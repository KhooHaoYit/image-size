import { deepStrictEqual } from 'assert';
import { getImageSizeResult, getStreamBasedResult, listFiles } from '.';

const imageSizeReposPath = process.argv[2];
if (!imageSizeReposPath) {
  console.error(`Please provide the path to the image-size repository`);
  process.exit(-1);
}

(async () => {
  for await (const path of listFiles(`${imageSizeReposPath}/specs/images`)) {
    console.log(path);
    const [imageSize, streamBased] = await Promise.all([
      Promise.resolve(console.time('imageSize'))
        .then(() => getImageSizeResult({ path }))
        .finally(() => console.timeEnd('imageSize')),
      Promise.resolve(console.time('streamBased'))
        .then(() => getStreamBasedResult({ path }))
        .finally(() => console.timeEnd('streamBased')),
    ]);
    try {
      deepStrictEqual(
        imageSize,
        streamBased.imageSize,
      );
      console.log('OK');
    } catch (err) {
      console.log(imageSize);
      console.log(streamBased.imageSize);
    }
  }
})();
