import { ExtractSize } from "../utils/sizeExtractor";

export const extractJ2cSize = async function* (stream) {
  if (await stream.readUInt32BE(0) !== 0xff4fff51)
    return;
  return yield {
    width: await stream.readUint32BE(8),
    height: await stream.readUint32BE(12),
  };
} satisfies ExtractSize;
