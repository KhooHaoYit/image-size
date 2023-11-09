import { ExtractSize } from "../utils/sizeExtractor";

export const extractIcnsSize = async function* (stream) {
  if (await stream.readString(0, 4) !== 'icns')
    return;
  const fileLength = await stream.readUint32BE(FILE_LENGTH_OFFSET);
  let imageOffset = SIZE_HEADER;
  do {
    const iconType = await stream.readString(imageOffset, ENTRY_LENGTH_OFFSET);
    const size = ICON_TYPE_SIZE[iconType];
    if (!size)
      throw new Error(`Unknown iconType: ${iconType}`);
    yield { width: size, height: size, type: iconType };
    imageOffset += await stream.readUint32BE(imageOffset + ENTRY_LENGTH_OFFSET);
  } while (imageOffset !== fileLength);
} satisfies ExtractSize;

const SIZE_HEADER = 4 + 4;
const FILE_LENGTH_OFFSET = 4;
const ENTRY_LENGTH_OFFSET = 4;
const ICON_TYPE_SIZE: Record<string, number | undefined> = {
  ICON: 32,
  'ICN#': 32,
  // m => 16 x 16
  'icm#': 16,
  icm4: 16,
  icm8: 16,
  // s => 16 x 16
  'ics#': 16,
  ics4: 16,
  ics8: 16,
  is32: 16,
  s8mk: 16,
  icp4: 16,
  // l => 32 x 32
  icl4: 32,
  icl8: 32,
  il32: 32,
  l8mk: 32,
  icp5: 32,
  ic11: 32,
  // h => 48 x 48
  ich4: 48,
  ich8: 48,
  ih32: 48,
  h8mk: 48,
  // . => 64 x 64
  icp6: 64,
  ic12: 32,
  // t => 128 x 128
  it32: 128,
  t8mk: 128,
  ic07: 128,
  // . => 256 x 256
  ic08: 256,
  ic13: 256,
  // . => 512 x 512
  ic09: 512,
  ic14: 512,
  // . => 1024 x 1024
  ic10: 1024,
};
