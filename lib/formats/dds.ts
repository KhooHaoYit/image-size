import { ExtractSize } from "../utils/sizeExtractor";

export const extractDdsSize = async function* (stream) {
  if (await stream.readString(0, 4) !== 'DDS ')
    return;
  return yield {
    height: await stream.readUint32LE(12),
    width: await stream.readUint32LE(16),
  };
} satisfies ExtractSize;
