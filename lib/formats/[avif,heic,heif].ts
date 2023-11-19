import { ExtractSize } from "../utils/sizeExtractor";
import { StreamParser } from "../utils/streamParser";

const extractSize = (formats: string[], targetFormat: string) => {
  return async function* (stream) {
    const ftypBox = await readFtypBox(stream, 0);
    if (ftypBox.type !== 'ftyp')
      return;
    for (const currentFormat of formats) {
      const foundIndex = [ftypBox.minorVersion, ...ftypBox.compatibleBrands].indexOf(currentFormat);
      if (foundIndex === -1)
        continue;
      if (currentFormat !== targetFormat)
        return;
      break;
    }
    loop: for (
      let currentBox
      ; currentBox = await readBox(
        stream,
        currentBox
          ? currentBox.offset + currentBox.size
          : ftypBox.offset + ftypBox.size)
      ;
    ) switch (currentBox.type) {
      default:
        break;
      case 'mdat':
        return;
      case 'meta': {
        const parentBox = currentBox;
        for (
          let currentBox
          ; isParentLastChildBox(parentBox, currentBox)
          && (currentBox = await readBox(
            stream,
            currentBox
              ? currentBox.offset + currentBox.size
              : parentBox.itemOffset + 4))
          ;
        ) switch (currentBox.type) {
          default:
            break;
          case 'iprp': {
            const parentBox = currentBox;
            const ipcoBox = await readBox(stream, parentBox.itemOffset);
            if (ipcoBox.type !== 'ipco')
              throw new Error(`boxType isn't ipco`);
            for (
              let currentBox
              ; isParentLastChildBox(parentBox, currentBox)
              && (currentBox = await readBox(
                stream,
                currentBox
                  ? currentBox.offset + currentBox.size
                  : ipcoBox.itemOffset))
              ;
            ) switch (currentBox.type) {
              default:
                break;
              case 'ispe': {
                const width = await stream.readUint32BE(currentBox.itemOffset + 4);
                const height = await stream.readUint32BE(currentBox.itemOffset + 4 + 4);
                return yield { width, height };
              } break;
            }
          } break;
          // case 'iloc':
          //   break;
          // case 'iinf': {
          //   const parentBox = currentBox;
          //   const itemCount = await stream.readUint16BE(parentBox.itemOffset);
          //   for (
          //     let currentBox, remain = itemCount
          //     ; currentBox = await readFullBox(
          //       stream,
          //       currentBox
          //         ? currentBox.offset + currentBox.size
          //         : parentBox.itemOffset + 2
          //     ), remain
          //     ; --remain
          //   ) switch (currentBox.type) {
          //     default:
          //       break;
          //     case 'infe': {
          //       const itemId = await stream.readUint16BE(currentBox.itemOffset);
          //       // const itemName = await stream.readString();
          //       console.log(itemId);
          //     } break;
          //   }
          // } break;
        }
        break loop;
      } break;
    }
  } satisfies ExtractSize;
}

export const extractAvifSize = extractSize(['avif', 'heic', 'heif'], 'avif');
export const extractHeicSize = extractSize(['avif', 'heic', 'heif'], 'heic');
export const extractHeifSize = extractSize(['avif', 'heic', 'heif'], 'heif');

async function readFtypBox(stream: StreamParser, offset: number) {
  const box = await readBox(stream, offset);
  if (box.type !== 'ftyp')
    throw new Error(`Expected ftyp box type, received: ${box.type}`);
  const majorBrand = await stream.readString(box.itemOffset, 4);
  const minorVersion = await stream.readUint32BE(box.itemOffset + 4);
  const compatibleBrands = await stream.readString(box.itemOffset + 8, box.offset + box.size - (box.itemOffset + 8))
    .then(text => text.match(/..../g) ?? []);
  return {
    ...box,
    majorBrand,
    minorVersion,
    compatibleBrands,
  };
}

async function readBox(stream: StreamParser, offset: number) {
  const size = await stream.readUint32BE(offset);
  const typeBuffer = await stream.read(offset + 4, 4);
  if ( // http://www.columbia.edu/kermit/ascii.html
    typeBuffer[0] < 32 || typeBuffer[0] > 126
    || typeBuffer[1] < 32 || typeBuffer[1] > 126
    || typeBuffer[2] < 32 || typeBuffer[2] > 126
    || typeBuffer[3] < 32 || typeBuffer[3] > 126
  ) throw new Error(`type isn't a printable characters`);
  return {
    size: size,
    type: typeBuffer.toString(),
    offset: offset,
    itemOffset: offset + 8,
  };
}

async function readFullBox(stream: StreamParser, offset: number) {
  const box = await readBox(stream, offset);
  const version = await stream.readUint8(box.itemOffset);
  const flags = await stream.readUintBE(box.itemOffset + 1, 3);
  return {
    ...box,
    version, flags,
    itemOffset: box.itemOffset + 4,
  };
}

function isParentLastChildBox(
  parentBox: Awaited<ReturnType<typeof readBox>>,
  currentBox?: Awaited<ReturnType<typeof readBox>>,
) {
  if (!currentBox)
    return true;
  return currentBox.offset + currentBox.size < parentBox.offset + parentBox.size;
}
