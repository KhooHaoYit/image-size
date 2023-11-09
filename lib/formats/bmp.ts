import { ExtractSize } from "../utils/sizeExtractor";

export const extractBmpSize = async function* (stream) {
  if (await stream.read(0, 2) + '' !== 'BM')
    return;
  return yield {
    width: await stream.readUint32LE(18),
    height: Math.abs(await stream.readInt32LE(22)),
  };
} satisfies ExtractSize;
