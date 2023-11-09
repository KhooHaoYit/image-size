import { ExtractSize } from "../utils/sizeExtractor";

export const extractWebpSize = async function* (stream) {
  const riffHeader = 'RIFF' === await stream.read(0, 4) + '';
  const webpHeader = 'WEBP' === await stream.read(8, 4) + '';
  const vp8Header = 'VP8' === await stream.read(12, 3) + '';
  if (!riffHeader || !webpHeader || !vp8Header)
    return;
  switch (await stream.readString(12, 4)) {
    default:
      break;
    case 'VP8X': {
      const extendedHeader = await stream.readUint8(20);
      const validStart = (extendedHeader & 0xc0) === 0;
      const validEnd = (extendedHeader & 0x01) === 0;
      if (!validStart || !validEnd)
        break;
      return yield {
        width: 1 + await stream.readUIntLE(20 + 4, 3),
        height: 1 + await stream.readUIntLE(20 + 7, 3),
      };
    } break;
    case 'VP8 ': {
      // `& 0x3fff` returns the last 14 bits
      // TO-DO: include webp scaling in the calculations
      return yield {
        width: await stream.readInt16LE(20 + 6) & 0x3fff,
        height: await stream.readInt16LE(20 + 8) & 0x3fff,
      };
    } break;
    case 'VP8L': {
      const signature = await stream.read(20 + 3, 3);
      if (signature.toString('hex') === '9d012a')
        break;
      const buffer = await stream.read(20 + 1, 4);
      return yield {
        width: 1 + (((buffer[1] & 0x3f) << 8) | buffer[0]),
        height: 1 + (((buffer[3] & 0xf) << 10) | (buffer[2] << 2) | ((buffer[1] & 0xc0) >> 6)),
      };
    } break;
  }
} satisfies ExtractSize;
