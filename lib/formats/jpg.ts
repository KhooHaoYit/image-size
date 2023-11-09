import { ExtractSize } from "../utils/sizeExtractor";

const EXIF_MARKER = 0x45786966
const APP1_DATA_SIZE_BYTES = 2
const EXIF_HEADER_BYTES = 6
const TIFF_BYTE_ALIGN_BYTES = 2
const BIG_ENDIAN_BYTE_ALIGN = 0x4d4d
const LITTLE_ENDIAN_BYTE_ALIGN = 0x4949

// Each entry is exactly 12 bytes
const IDF_ENTRY_BYTES = 12
const NUM_DIRECTORY_ENTRIES_BYTES = 2

export const extractJpgSize = async function* (stream) {
  if (await stream.readUInt16BE(0) !== 0xffd8)
    return;
  let currentOffset = 4, orientation: number | null = null;
  while (true) {
    const blockSize = await stream.readUInt16BE(currentOffset);
    if (await stream.readUInt32BE(currentOffset + 2) === EXIF_MARKER) {
      const byteAlignOffset = currentOffset + APP1_DATA_SIZE_BYTES + EXIF_HEADER_BYTES;
      const byteAlign = await stream.readUint16BE(byteAlignOffset);
      if (byteAlign === BIG_ENDIAN_BYTE_ALIGN || byteAlign === LITTLE_ENDIAN_BYTE_ALIGN) {
        stream.setEndianness(byteAlign === BIG_ENDIAN_BYTE_ALIGN ? 'BE' : 'LE');
        // TODO: assert that this contains 0x002A
        // let STATIC_MOTOROLA_TIFF_HEADER_BYTES = 2
        // let TIFF_IMAGE_FILE_DIRECTORY_BYTES = 4
        // TODO: derive from TIFF_IMAGE_FILE_DIRECTORY_BYTES
        const idfOffset = 8;
        // IDF osset works from right after the header bytes
        // (so the offset includes the tiff byte align)
        const offset = byteAlignOffset + idfOffset;
        const idfDirectoryEntries = await stream.readUInt16(offset);

        let currentOffset = offset + NUM_DIRECTORY_ENTRIES_BYTES;
        for (
          let directoryEntryNumber = 0;
          directoryEntryNumber < idfDirectoryEntries;
          directoryEntryNumber++, currentOffset += IDF_ENTRY_BYTES
        ) {
          const tagNumber = await stream.readUInt16(currentOffset);

          // 0x0112 (decimal: 274) is the `orientation` tag ID
          if (tagNumber === 274) {
            const dataFormat = await stream.readUInt16(currentOffset + 2);
            if (dataFormat !== 3)
              break;

            // unsinged int has 2 bytes per component
            // if there would more than 4 bytes in total it's a pointer
            const numberOfComponents = await stream.readUInt32(currentOffset + 4);
            if (numberOfComponents !== 1)
              break;

            orientation = await stream.readUInt16(currentOffset + 8);
            break;
          }
        }

        stream.setEndianness();
      }
    }
    currentOffset += blockSize;
    const type = await stream.readUInt8(currentOffset + 1);
    if ([0xc0, 0xc1, 0xc2].indexOf(type) === -1) {
      currentOffset += 2;
      continue;
    }
    return yield {
      height: await stream.readUInt16BE(currentOffset + 5),
      width: await stream.readUInt16BE(currentOffset + 7),
      orientation,
    };
  }
} satisfies ExtractSize;
