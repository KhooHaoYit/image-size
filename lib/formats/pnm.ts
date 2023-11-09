import { ExtractSize } from "../utils/sizeExtractor";

export const extractPnmSize = async function* (stream) {
  const signature = await stream.readString(0, 2);
  if (PNMTypes[signature] === undefined)
    return;
  let width: number | undefined, height: number | undefined;
  loop: for (let offset = 3; width === undefined || height === undefined; ++offset) {
    const lineBuffers = [];
    for (; true; ++offset) {
      const buf = await stream.read(offset, 1);
      if (buf.indexOf('\n') === 0)
        break;
      lineBuffers.push(buf);
    }
    const line = Buffer.concat(lineBuffers) + '';
    if (line.startsWith('#')) // comment
      continue;
    if (signature !== 'P7') { // pam
      [width, height] = line
        .split(' ')
        .map(val => +val);
      break;
    }
    const [type, value] = line.split(' ');
    switch (type) {
      default:
        break;
      case 'ENDHDR':
        break loop;
      case 'WIDTH': {
        width = +value;
      } break;
      case 'HEIGHT': {
        height = +value;
      } break;
    }
  }
  if (width === undefined || height === undefined)
    return;
  return yield { width, height };
} satisfies ExtractSize;

const PNMTypes: Record<string, string | undefined> = {
  P1: 'pbm/ascii',
  P2: 'pgm/ascii',
  P3: 'ppm/ascii',
  P4: 'pbm',
  P5: 'pgm',
  P6: 'ppm',
  P7: 'pam',
  PF: 'pfm',
};

/*

ppm file format specification
 -> https://netpbm.sourceforge.net/doc/ppm.html

*/
