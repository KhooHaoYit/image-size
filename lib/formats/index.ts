
import { ExtractSize } from "../utils/sizeExtractor";
import {
  extractCurSize,
  extractIcoSize,
} from "./[ico,cur]";
import { extractBmpSize } from "./bmp";
import { extractDdsSize } from "./dds";
import { extractGifSize } from "./gif";
import { extractIcnsSize } from "./icns";
import { extractJ2cSize } from "./j2c";
import { extractJp2Size } from "./jp2";
import { extractJpgSize } from "./jpg";
import { extractKtxSize } from "./ktx";
import { extractPngSize } from "./png";
import { extractPnmSize } from "./pnm";
import { extractPsdSize } from "./psd";
import { extractSvgSize } from "./svg";
import { extractTgaSize } from "./tga";
import { extractTiffSize } from "./tiff";
import { extractWebpSize } from "./webp";

export const formats = <const>[
  ['ico', extractIcoSize],
  ['cur', extractCurSize],

  ['bmp', extractBmpSize],
  ['dds', extractDdsSize],
  ['gif', extractGifSize],
  ['icns', extractIcnsSize],
  ['j2c', extractJ2cSize],
  ['jp2', extractJp2Size],
  ['jpg', extractJpgSize],
  ['ktx', extractKtxSize],
  ['png', extractPngSize],
  ['pnm', extractPnmSize],
  ['psd', extractPsdSize],
  ['svg', extractSvgSize],
  ['tga', extractTgaSize],
  ['tiff', extractTiffSize],
  ['webp', extractWebpSize],
] satisfies ReadonlyArray<readonly [string, ExtractSize]>;
