import { ExtractSize } from "../utils/sizeExtractor";

export const extractTiffSize = async function* (stream) {
  // 0x492049, // currently not supported
  // 0x4d4d002a, // BigTIFF > 4GB. currently not supported
  /// Image File Header
  const byteOrderHeader = await stream.readString(0, 2);
  if (
    byteOrderHeader !== 'II' /// LE
    && byteOrderHeader !== 'MM' /// BE
  ) return;
  stream.setEndianness(byteOrderHeader === 'II' ? 'LE' : 'BE');
  if (await stream.readUint(2, 2) !== 42)
    return;
  const ifdOffset = await stream.readUint(4, 4);
  /// End of Image File Header
  let width = null, height = null;
  let entryAmount = await stream.readUint(ifdOffset, 2);
  for (let currentOffset = ifdOffset + 2; entryAmount; --entryAmount) {
    const tag = await stream.readUint(currentOffset, 2);
    const type = await stream.readUint(currentOffset + 2, 2);
    const count = await stream.readUint(currentOffset + 4, 4);
    switch (tag) {
      default:
        break;
      case TagType.ImageWidth:
      case TagType.ImageLength: {
        if (count !== 1)
          break;
        const valueSize = type === FieldType.SHORT ? 2 : 4;
        const size = await stream.readUint(currentOffset + 8, valueSize);
        if (tag === TagType.ImageWidth)
          width = size;
        else
          height = size;
      } break;
    }
    currentOffset += 12;
    if (width !== null && height !== null)
      break;
  }
  if (width === null || height === null)
    return;
  return yield { width, height };
} satisfies ExtractSize;

enum TagType {
  ImageWidth = 0x100,
  ImageLength = 0x101,
}

enum FieldType {
  BYTE = 1,
  ASCII = 2,
  SHORT = 3,
  LONG = 4,
  RATIONAL = 5,
}

/*

tiff ifd format
 -> https://www.nationalarchives.gov.uk/PRONOM/Format/proFormatSearch.aspx?status=detailReport&id=1099&strPageToDisplay=summary
 -> https://web.archive.org/web/20211031081158/https://www.adobe.io/content/dam/udp/en/open/standards/tiff/TIFF6.pdf

*/
