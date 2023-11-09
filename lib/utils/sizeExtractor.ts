import { formats } from "../formats";
import { StreamReader } from "./streamReader";
import { StreamParser } from "./streamParser";
import { TransformOptions } from "stream";

const setupEvent = <TEvent>() => {
  return <TClass>(c: TClass) => {
    return c as (abstract new (...args: any) => TEvent) & TClass;
  }
}

interface Event<TName extends string, TValues extends unknown[]> {
  addListener(event: TName, listener: (...args: TValues) => void): this;
  emit(event: TName, ...args: TValues): boolean;
  on(event: TName, listener: (...args: TValues) => void): this;
  once(event: TName, listener: (...args: TValues) => void): this;
  prependListener(event: TName, listener: (...args: TValues) => void): this;
  prependOnceListener(event: TName, listener: (...args: TValues) => void): this;
  removeListener(event: TName, listener: (...args: TValues) => void): this;
}

export interface ExtractSize {
  (stream: StreamParser): AsyncGenerator<{ width: number, height: number }, void, void>
}

type TExtracted<TFormat extends typeof formats = typeof formats> = {
  [K in keyof TFormat]: [data: ReturnType<TFormat[K][1]> extends AsyncGenerator<infer TResult> ? TResult : any, format: TFormat[K][0]]
}[any]

export type ExtractedSize = TExtracted;

type SizeExtractorEvent =
  & Event<'parseError', [error: unknown, format: ExtractedSize[1]]>
  & Event<'parseDone', [format: ExtractedSize[1]]>
  & Event<'parseAllDone', []>
  & Event<'size', ExtractedSize>

// from image-size library
export interface ISize {
  width: number | undefined;
  height: number | undefined;
  orientation?: number;
  type?: string;
}
export interface ISizeCalculationResult extends ISize {
  images?: ISize[];
}

export class SizeExtractor extends setupEvent<SizeExtractorEvent>()(StreamReader) {

  imageSize?: ISizeCalculationResult;
  sizes: ExtractedSize[] = [];

  constructor(
    options: {
      passthrough: boolean
      whitelistFormats?: ExtractedSize[1][]
      blacklistFormats?: ExtractedSize[1][]
    },
    transformOptions?: TransformOptions,
  ) {
    super(transformOptions);
    if (!options.passthrough)
      this.resume();
    this.on('size', (...args) => {
      this.sizes.push(args);
      const [data, format] = args;
      if (!this.imageSize) {
        this.imageSize = {
          height: data.height,
          width: data.width,
          type: format,
        };
        if (format === 'jpg' && data.orientation !== null)
          this.imageSize.orientation = data.orientation;
        if (format === 'icns')
          this.imageSize.images = [data];
        return;
      }
      if (this.imageSize.type !== format)
        return;
      if (format === 'ico')
        this.imageSize.images ??= [{ width: this.imageSize.width, height: this.imageSize.height }];
      this.imageSize.images?.push(<ISize>data);
    });
    Promise.all(
      formats
        .filter(([format]) => {
          if (options.whitelistFormats)
            return options.whitelistFormats.indexOf(format) !== -1;
          if (options.blacklistFormats)
            return options.blacklistFormats.indexOf(format) === -1;
          return true;
        })
        .map(async ([format, handler]) => {
          try {
            for await (const result of handler(new StreamParser(this)))
              this.emit('size', result, format);
          } catch (error) {
            this.emit('parseError', error, format);
          } finally {
            this.emit('parseDone', format);
          }
        })
    ).finally(() => this.emit('parseAllDone'));
  }

}
