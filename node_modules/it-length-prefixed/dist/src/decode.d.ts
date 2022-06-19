import { Uint8ArrayList } from 'uint8arraylist';
import type { LengthDecoderFunction } from './varint-decode.js';
import type { Reader } from 'it-reader';
import type { Source, Transform } from 'it-stream-types';
export interface ReadState {
    dataLength: number;
}
export interface DecoderOptions {
    lengthDecoder?: LengthDecoderFunction;
    onData?: (data: Uint8Array) => void;
    onLength?: (length: number) => void;
    maxLengthLength?: number;
    maxDataLength?: number;
}
export interface ReadResult {
    mode: string;
    chunk?: Uint8ArrayList;
    buffer: Uint8ArrayList;
    state?: ReadState;
    data?: Uint8ArrayList;
}
export declare const MAX_LENGTH_LENGTH = 8;
export declare const MAX_DATA_LENGTH: number;
export declare function decode(options?: DecoderOptions): Transform<Uint8ArrayList | Uint8Array, Uint8Array>;
export declare namespace decode {
    var fromReader: (reader: Reader, options?: DecoderOptions | undefined) => Source<Uint8Array>;
}
//# sourceMappingURL=decode.d.ts.map