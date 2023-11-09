import { StreamReader } from "./streamReader";

export class StreamParser {
  stream: StreamReader
  endianness?: 'BE' | 'LE'

  constructor(stream: StreamReader) {
    this.stream = stream;
  }

  setEndianness(endianness?: typeof this.endianness) {
    this.endianness = endianness;
  }

  async read(offset: number, size: number) {
    return await this.stream.readRange({ offset, size });
  }

  async readString(offset: number, size: number, encoding?: BufferEncoding) {
    const buf = await this.read(offset, size);
    return buf.toString(encoding);
  }

  async readUInt8(offset: number) { const buf = await this.read(offset, 1); return buf.readUInt8(); }
  async readUint8(offset: number) { const buf = await this.read(offset, 1); return buf.readUint8(); }
  async readInt8(offset: number) { const buf = await this.read(offset, 1); return buf.readInt8(); }

  async readUInt16LE(offset: number) { const buf = await this.read(offset, 2); return buf.readUInt16LE(); }
  async readUInt16BE(offset: number) { const buf = await this.read(offset, 2); return buf.readUInt16BE(); }
  async readUint16LE(offset: number) { const buf = await this.read(offset, 2); return buf.readUint16LE(); }
  async readUint16BE(offset: number) { const buf = await this.read(offset, 2); return buf.readUint16BE(); }
  async readInt16LE(offset: number) { const buf = await this.read(offset, 2); return buf.readInt16LE(); }
  async readInt16BE(offset: number) { const buf = await this.read(offset, 2); return buf.readInt16BE(); }

  async readUInt32LE(offset: number) { const buf = await this.read(offset, 4); return buf.readUInt32LE(); }
  async readUInt32BE(offset: number) { const buf = await this.read(offset, 4); return buf.readUInt32BE(); }
  async readUint32LE(offset: number) { const buf = await this.read(offset, 4); return buf.readUint32LE(); }
  async readUint32BE(offset: number) { const buf = await this.read(offset, 4); return buf.readUint32BE(); }
  async readInt32LE(offset: number) { const buf = await this.read(offset, 4); return buf.readInt32LE(); }
  async readInt32BE(offset: number) { const buf = await this.read(offset, 4); return buf.readInt32BE(); }

  async readBigUInt64BE(offset: number) { const buf = await this.read(offset, 8); return buf.readBigUInt64BE(); }
  async readBigUInt64LE(offset: number) { const buf = await this.read(offset, 8); return buf.readBigUInt64LE(); }
  async readBigUint64BE(offset: number) { const buf = await this.read(offset, 8); return buf.readBigUint64BE(); }
  async readBigUint64LE(offset: number) { const buf = await this.read(offset, 8); return buf.readBigUint64LE(); }
  async readBigInt64BE(offset: number) { const buf = await this.read(offset, 8); return buf.readBigInt64BE(); }
  async readBigInt64LE(offset: number) { const buf = await this.read(offset, 8); return buf.readBigInt64LE(); }

  async readFloatLE(offset: number) { const buf = await this.read(offset, 4); return buf.readFloatLE(); }
  async readFloatBE(offset: number) { const buf = await this.read(offset, 4); return buf.readFloatBE(); }
  async readDoubleLE(offset: number) { const buf = await this.read(offset, 8); return buf.readDoubleLE(); }
  async readDoubleBE(offset: number) { const buf = await this.read(offset, 8); return buf.readDoubleBE(); }

  async readUInt16(offset: number) { if (!this.endianness) throw new Error(`endianness not set`); const buf = await this.read(offset, 2); return buf[`readUInt16${this.endianness}`](); }
  async readUint16(offset: number) { if (!this.endianness) throw new Error(`endianness not set`); const buf = await this.read(offset, 2); return buf[`readUint16${this.endianness}`](); }
  async readInt16(offset: number) { if (!this.endianness) throw new Error(`endianness not set`); const buf = await this.read(offset, 2); return buf[`readInt16${this.endianness}`](); }
  async readUInt32(offset: number) { if (!this.endianness) throw new Error(`endianness not set`); const buf = await this.read(offset, 4); return buf[`readUInt32${this.endianness}`](); }
  async readUint32(offset: number) { if (!this.endianness) throw new Error(`endianness not set`); const buf = await this.read(offset, 4); return buf[`readUint32${this.endianness}`](); }
  async readInt32(offset: number) { if (!this.endianness) throw new Error(`endianness not set`); const buf = await this.read(offset, 4); return buf[`readInt32${this.endianness}`](); }
  async readBigUInt64(offset: number) { if (!this.endianness) throw new Error(`endianness not set`); const buf = await this.read(offset, 8); return buf[`readBigUInt64${this.endianness}`](); }
  async readBigUint64(offset: number) { if (!this.endianness) throw new Error(`endianness not set`); const buf = await this.read(offset, 8); return buf[`readBigUint64${this.endianness}`](); }
  async readBigInt64(offset: number) { if (!this.endianness) throw new Error(`endianness not set`); const buf = await this.read(offset, 8); return buf[`readBigInt64${this.endianness}`](); }
  async readFloat(offset: number) { if (!this.endianness) throw new Error(`endianness not set`); const buf = await this.read(offset, 4); return buf[`readFloat${this.endianness}`](); }
  async readDouble(offset: number) { if (!this.endianness) throw new Error(`endianness not set`); const buf = await this.read(offset, 8); return buf[`readDouble${this.endianness}`](); }

  async readUIntLE(offset: number, byteLength: number) { const buf = await this.read(offset, byteLength); return buf.readUIntLE(0, byteLength); }
  async readUIntBE(offset: number, byteLength: number) { const buf = await this.read(offset, byteLength); return buf.readUIntBE(0, byteLength); }
  async readUintLE(offset: number, byteLength: number) { const buf = await this.read(offset, byteLength); return buf.readUintLE(0, byteLength); }
  async readUintBE(offset: number, byteLength: number) { const buf = await this.read(offset, byteLength); return buf.readUintBE(0, byteLength); }
  async readIntLE(offset: number, byteLength: number) { const buf = await this.read(offset, byteLength); return buf.readIntLE(0, byteLength); }
  async readIntBE(offset: number, byteLength: number) { const buf = await this.read(offset, byteLength); return buf.readIntBE(0, byteLength); }

  async readUInt(offset: number, byteLength: number) { if (!this.endianness) throw new Error(`endianness not set`); const buf = await this.read(offset, byteLength); return buf[`readUInt${this.endianness}`](0, byteLength); }
  async readUint(offset: number, byteLength: number) { if (!this.endianness) throw new Error(`endianness not set`); const buf = await this.read(offset, byteLength); return buf[`readUint${this.endianness}`](0, byteLength); }
  async readInt(offset: number, byteLength: number) { if (!this.endianness) throw new Error(`endianness not set`); const buf = await this.read(offset, byteLength); return buf[`readInt${this.endianness}`](0, byteLength); }

}
