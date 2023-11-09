import {
  Transform,
  TransformCallback,
} from "stream"

export class StreamReader extends Transform {

  constructor(
    ...args: ConstructorParameters<typeof Transform>
  ) {
    super(...args);
  }

  pendingRead: {
    offset: number
    size: number
    resolveCallback: (buf: Buffer) => any
    rejectCallback: (error: unknown) => any
    blocking: boolean
    afterWrite?: boolean
  }[] = [];

  bufferOffset = 0;
  bufferSize = 0;
  buffers: Buffer[] = [];

  peek(
    options:
      | { offset: number, size: number }
      | { start: number, end: number },
    afterWrite: boolean,
  ) {
    const [offset, size] = 'offset' in options
      ? [options.offset, options.size]
      : [options.start, options.end - options.start];
    if (this.bufferOffset > offset)
      return Promise.reject(new Error('Unable to read after it has processed'));
    return new Promise<Buffer>((rs, rj) => this.#handleRead({
      offset, size,
      resolveCallback: rs,
      rejectCallback: rj,
      blocking: false,
      afterWrite,
    }));
  }

  readRange(
    options:
      | { offset: number, size: number }
      | { start: number, end: number }
  ) {
    const [offset, size] = 'offset' in options
      ? [options.offset, options.size]
      : [options.start, options.end - options.start];
    if (this.bufferOffset > offset)
      return Promise.reject(new Error('Unable to read after it has processed'));
    return new Promise<Buffer>((rs, rj) => this.#handleRead({
      offset, size,
      resolveCallback: rs,
      rejectCallback: rj,
      blocking: true,
    }));
  }

  #pruneImmediate?: NodeJS.Immediate

  #handleRead(
    newEntry?: typeof this.pendingRead[0],
    isOnWrite?: boolean,
  ) {
    if (newEntry)
      this.pendingRead.push(newEntry);

    const doneRead: typeof this.pendingRead = [];
    for (const entry of newEntry ? [newEntry] : this.pendingRead) {
      const {
        offset, size, blocking, afterWrite,
        resolveCallback: callback,
      } = entry;
      if (afterWrite && !isOnWrite)
        continue;
      if (blocking) {
        if (offset + size > this.bufferOffset + this.bufferSize)
          continue; // range not fully buffered
      } else if (offset >= this.bufferOffset + this.bufferSize)
        continue; // range not arrived yet
      const currentBuffers: Buffer[] = [];
      let targetSize = size;
      let skip = offset - this.bufferOffset;
      for (const chunk of this.buffers) {
        if (skip >= chunk.length) {
          skip -= chunk.length;
          continue;
        }
        const trimmedChunk = chunk.subarray(Math.max(skip, 0));
        skip -= chunk.length;
        if (targetSize >= trimmedChunk.length) {
          targetSize -= trimmedChunk.length;
          currentBuffers.push(trimmedChunk);
          continue;
        }
        currentBuffers.push(trimmedChunk.subarray(0, targetSize));
        break;
      }
      callback(Buffer.concat(currentBuffers));
      doneRead.push(entry);
    }

    for (const entry of doneRead)
      this.pendingRead.splice(this.pendingRead.indexOf(entry), 1);


    if (!this.#pruneImmediate)
      this.#pruneImmediate = setImmediate(() => {
        let extraOffset = this.pendingRead.reduce(
          (minimum, { offset }) => Math.min(minimum, offset),
          Infinity,
        ) - this.bufferOffset;
        let removeCount = 0;
        let append: Buffer | null = null;
        for (const chunk of this.buffers) {
          ++removeCount;
          if (extraOffset >= chunk.length) {
            extraOffset -= chunk.length;
            this.bufferSize -= chunk.length;
            this.bufferOffset += chunk.length;
            continue;
          }
          const remain = chunk.subarray(extraOffset);
          this.bufferSize -= extraOffset;
          this.bufferOffset += extraOffset;
          append = remain;
          break;
        }
        this.buffers.splice(0, removeCount);
        if (append)
          this.buffers.unshift(append);
        this.#pruneImmediate = undefined;
      });
  }

  _transform(
    chunk: Buffer,
    encoding: BufferEncoding,
    callback: TransformCallback,
  ): void {
    this.buffers.push(chunk);
    this.bufferSize += chunk.length;
    this.#handleRead(undefined, true);
    callback(null, chunk);
  }

  _final(callback: (error?: Error | null | undefined) => void): void {
    const error = this.errored ?? new Error('No more data to read');
    for (const { rejectCallback: rjCb } of this.pendingRead.splice(0))
      rjCb(error);
    setImmediate(callback);
  }

}
