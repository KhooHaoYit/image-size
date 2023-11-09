import { ExtractSize } from "../utils/sizeExtractor";

export const extractKtxSize = async function* (stream) {
  if (await stream.readString(1, 6) !== 'KTX 11')
    return;
  return yield {
    width: await stream.readUint32LE(36),
    height: await stream.readUint32LE(40),
  };
} satisfies ExtractSize;
