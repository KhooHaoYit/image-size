import { ExtractSize } from "../utils/sizeExtractor";

export const extractTgaSize = async function* (stream) {
  if (
    await stream.readUInt16LE(0) !== 0
    || await stream.readUInt16LE(4) !== 0
  ) return;
  return yield {
    width: await stream.readUint16LE(12),
    height: await stream.readUint16LE(14),
  };
} satisfies ExtractSize;
