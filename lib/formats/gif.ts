import { ExtractSize } from "../utils/sizeExtractor";

export const extractGifSize = async function* (stream) {
  if (!/^GIF8[79]a$/.test(await stream.read(0, 6) + ''))
    return;
  return yield {
    width: await stream.readUint16LE(6),
    height: await stream.readUint16LE(8),
  };
} satisfies ExtractSize;
