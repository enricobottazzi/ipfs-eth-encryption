import { Uint8ArrayList } from 'uint8arraylist';
import type { LengthEncoderFunction } from './varint-encode.js';
import type { Transform } from 'it-stream-types';
interface EncoderOptions {
    poolSize?: number;
    minPoolSize?: number;
    lengthEncoder?: LengthEncoderFunction;
}
export declare const MIN_POOL_SIZE = 8;
export declare const DEFAULT_POOL_SIZE: number;
export declare function encode(options?: EncoderOptions): Transform<Uint8ArrayList | Uint8Array, Uint8Array>;
export declare namespace encode {
    var single: (chunk: Uint8Array | Uint8ArrayList, options?: EncoderOptions | undefined) => Uint8ArrayList;
}
export {};
//# sourceMappingURL=encode.d.ts.map