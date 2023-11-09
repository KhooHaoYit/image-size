import { ExtractSize } from "../utils/sizeExtractor";

export const extractPsdSize = async function* (stream) {
  if (await stream.read(0, 4) + '' !== '8BPS')
    return;
  return yield {
    height: await stream.readUint32BE(14),
    width: await stream.readUint32BE(18),
  };
} satisfies ExtractSize;
