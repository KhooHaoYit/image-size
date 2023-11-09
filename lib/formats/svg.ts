import { isUtf8 } from 'buffer';
import { ExtractSize } from "../utils/sizeExtractor";

export const extractSvgSize = async function* (stream) {
  let offset = 0;
  const stringIterator = stringParser();
  let width: string | undefined,
    height: string | undefined,
    viewBox: string | undefined;
  loop: while (true) {
    // speedup `<svg` search
    const peekBuffer = await stream.stream.peek({ start: offset, end: Infinity }, true);
    if (!isBufferPartialUtf8(peekBuffer))
      return;
    const foundSvgStart = peekBuffer.indexOf('<svg');
    if (foundSvgStart === -1) {
      offset += Math.max(peekBuffer.length - 4, 0);
      continue;
    } else offset += foundSvgStart;
    // end of speedup `<svg` search
    if (
      (await stringIterator.next()).value !== '<'
      || (await stringIterator.next()).value !== 's'
      || (await stringIterator.next()).value !== 'v'
      || (await stringIterator.next()).value !== 'g'
    ) continue;
    while (true) {
      for await (const c of stringParser()) { // break destroy iterator
        if (/^\s$/.test(c))
          continue;
        break;
      }
      --offset;
      const nameChars = [];
      for await (const c of stringParser()) { // break destroy iterator
        if (c === '>')
          break loop;
        if (c !== '=') {
          nameChars.push(c);
          continue;
        }
        const valueChars = [];
        const { value: delimiter } = await stringIterator.next();
        for await (const c of stringParser()) { // break destroy iterator
          if (c === delimiter)
            break;
          valueChars.push(c);
        }
        const name = nameChars.join('').toLocaleLowerCase();
        const value = valueChars.join(''); // TODO: myabe lower case??
        switch (name) {
          default:
            break;
          case 'width': {
            width = value;
          } break;
          case 'height': {
            height = value;
          } break;
          case 'viewbox': {
            viewBox = value;
          } break;
        }
        if ((width && height && viewBox) !== undefined)
          break loop;
        break;
      }
    }
  }

  const widthPx = parseLength(width);
  const heightPx = parseLength(height);
  if (widthPx && heightPx)
    return yield { width: widthPx, height: heightPx };
  if (viewBox) {
    const [, , vbWidth, vbHeight] = viewBox.split(' ').map(val => +val);
    if (widthPx)
      return yield { width: widthPx, height: Math.floor(widthPx * vbHeight / vbWidth) };
    if (heightPx)
      return yield { width: Math.floor(heightPx * vbWidth / vbHeight), height: heightPx };
    return yield { width: vbWidth, height: vbHeight };
  }

  async function* stringParser() {
    loop: while (true) {
      const charBufs: Buffer[] = [];
      const validIndexes = new Set(utf8formats.map((_, index) => index));
      for (let utf8Index = 0; ; ++utf8Index) {
        const byte = await stream.read(offset++, 1);
        charBufs.push(byte);
        for (const formatIndex of validIndexes) {
          const utf8format = utf8formats[formatIndex];
          const [start, end] = utf8format[utf8Index];
          if (byte[0] >= start && byte[0] <= end) {
            if (utf8format.length - 1 !== utf8Index)
              continue;
            yield Buffer.concat(charBufs)
              .toString('utf8');
            continue loop;
          }
          validIndexes.delete(formatIndex);
        }
        if (!validIndexes.size)
          return;
      }
    }
  }
} satisfies ExtractSize;

function isBufferPartialUtf8(buf: Buffer) {
  return isUtf8(buf)
    || isUtf8(buf.subarray(0, Math.max(buf.length - 1, 0)))
    || isUtf8(buf.subarray(0, Math.max(buf.length - 2, 0)))
    || isUtf8(buf.subarray(0, Math.max(buf.length - 3, 0)));
}

function parseLength(length?: string) {
  const found = length?.match(/^([0-9.]+(?:e\d+)?)([a-z]+)?$/);
  if (!found)
    return;
  return Math.round(+found[1] * (units[found[2]] ?? 1));
}

const INCH_CM = 2.54;
const units: Record<string, number> = {
  in: 96,
  cm: 96 / INCH_CM,
  em: 16,
  ex: 8,
  m: (96 / INCH_CM) * 100,
  mm: 96 / INCH_CM / 10,
  pc: 96 / 72 / 12,
  pt: 96 / 72,
  px: 1,
};

const utf8tail = [0x80, 0xbf] satisfies [number, number];

// https://github.com/hcodes/isutf8/blob/master/src/index.ts
// https://datatracker.ietf.org/doc/html/rfc3629
const utf8formats = [
  // utf8-1
  [[0x00, 0x7f]],
  // utf8-2
  [[0xc2, 0xdf], utf8tail],
  // utf8-3
  [[0xe0, 0xe0], [0xa0, 0xbf], utf8tail],
  [[0xe1, 0xec], utf8tail, utf8tail],
  [[0xed, 0xed], [0x80, 0x9f], utf8tail],
  [[0xee, 0xef], utf8tail, utf8tail],
  // utf8-4
  [[0xf0, 0xf0], [0x90, 0xbf], utf8tail, utf8tail],
  [[0xf1, 0xf3], utf8tail, utf8tail, utf8tail],
  [[0xf4, 0xf4], [0x80, 0x8f], utf8tail, utf8tail],
] satisfies [start: number, end: number][][];
