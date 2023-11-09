import { ExtractSize } from "../utils/sizeExtractor";

const pngSignature = 'PNG\r\n\x1a\n';
const pngImageHeaderChunkName = 'IHDR';
// Used to detect "fried" png's: http://www.jongware.com/pngdefry.html
const pngFriedChunkName = 'CgBI'

export const extractPngSize = async function* (stream) {
  if (await stream.read(1, 7) + '' !== pngSignature)
    return;
  const imageHeaderOrFried = await stream.read(12, 4) + '';
  let options: Parameters<typeof stream.read> | undefined;
  if (imageHeaderOrFried === pngImageHeaderChunkName)
    options = [16, 8];
  if (imageHeaderOrFried === pngFriedChunkName)
    options = [32, 8];
  if (!options)
    return;
  const buf = await stream.read(...options);
  return yield {
    width: buf.readUint32BE(),
    height: buf.readUint32BE(4),
  };
} satisfies ExtractSize;
