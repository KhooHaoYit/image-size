import { ExtractSize } from "../utils/sizeExtractor";

const TYPE_ICON = 1;
const TYPE_CURSOR = 2;
const SIZE_HEADER = 2 + 2 + 2;
const SIZE_IMAGE_ENTRY = 1 + 1 + 1 + 1 + 2 + 2 + 4 + 4;

const extractSize = (targetImageType: number) => {
  return async function* (stream) {
    const reserved = await stream.readUInt16LE(0);
    const imageCount = await stream.readUInt16LE(4);
    if (reserved !== 0 || imageCount === 0)
      return;
    const imageType = await stream.readUInt16LE(2);
    if (imageType !== targetImageType)
      return;
    for (
      let amount = imageCount, offset = SIZE_HEADER
      ; amount
      ; --amount, offset += SIZE_IMAGE_ENTRY
    ) {
      yield {
        width: await stream.readUint8(offset) || 256,
        height: await stream.readUint8(offset + 1) || 256,
      };
    }
  } satisfies ExtractSize;
}

export const extractIcoSize = extractSize(TYPE_ICON);
export const extractCurSize = extractSize(TYPE_CURSOR);
