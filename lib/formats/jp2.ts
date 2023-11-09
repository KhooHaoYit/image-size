import { ExtractSize } from "../utils/sizeExtractor";

export const extractJp2Size = async function* (stream) {
  const signatureLength = await stream.readUInt32BE(0);
  const signature = await stream.readString(4, 4);
  if (signature !== BoxTypes.jp__ || signatureLength < 1)
    return;
  const ftypeBoxStart = signatureLength + 4;
  const ftypBoxLength = await stream.readUInt32BE(signatureLength);
  if (await stream.readString(ftypeBoxStart, 4) !== BoxTypes.ftyp)
    return;
  let ihdrOffset = signatureLength + 4 + ftypBoxLength;
  switch (await stream.readString(ihdrOffset, 4)) {
    default:
      return;
    case BoxTypes.rreq: {
      ihdrOffset += 4;
      const unit = await stream.readUint8(ihdrOffset);
      let offset = 1 + 2 * unit;
      const numStdFlags = await stream.readUInt16BE(ihdrOffset + offset);
      const flagsLength = numStdFlags * (2 + unit);
      offset += 2 + flagsLength;
      const numVendorFeatures = await stream.readUInt16BE(ihdrOffset + offset);
      const featuresLength = numVendorFeatures * (16 + unit);
      const rreqLength = offset + 2 + featuresLength;
      ihdrOffset += 4 + rreqLength;
      ihdrOffset += 8;
    } break;
    case BoxTypes.jp2h: {
      ihdrOffset += 8;
    } break;
  }
  return yield {
    height: await stream.readUint32BE(ihdrOffset + 4),
    width: await stream.readUint32BE(ihdrOffset + 8),
  };
} satisfies ExtractSize;

enum BoxTypes {
  ftyp = 'ftyp',
  ihdr = 'ihdr',
  jp2h = 'jp2h',
  jp__ = 'jP  ',
  rreq = 'rreq',
  xml_ = 'xml ',
};
