import { handshake } from 'it-handshake'
import * as lp from 'it-length-prefixed'
import type { Duplex } from 'it-stream-types'
import type { Uint8ArrayList } from 'uint8arraylist'

export interface ProtobufStream {
  read: (bytes?: number) => Promise<Uint8ArrayList>
  readLP: () => Promise<Uint8ArrayList>
  readPB: <T>(proto: {decode: (data: Uint8Array) => T}) => Promise<T>
  write: (input: Uint8Array | Uint8ArrayList) => void
  writeLP: (input: Uint8Array | Uint8ArrayList) => void
  writePB: (data: Uint8Array | Uint8ArrayList, proto: {encode: (data: any) => Uint8Array}) => void
  pb: <Return>(proto: {encode: (data: any) => Uint8Array, decode: (data: Uint8Array) => Return}) => {read: () => Promise<Return>, write: (d: Uint8Array) => void}

  // return vanilla duplex
  unwrap: () => Duplex<Uint8Array>
}

export interface LengthDecoderFunction {
  (data: Uint8Array | Uint8ArrayList): number
  bytes: number
}

export interface LengthEncoderFunction {
  (value: number, target: Uint8Array, offset: number): number | Uint8Array
  bytes: number
}

export interface Opts {
  // encoding opts
  poolSize: number
  minPoolSize: number
  lengthEncoder: LengthEncoderFunction

  // decoding opts
  lengthDecoder: LengthDecoderFunction
  maxLengthLength: number
  maxDataLength: number
}

export function pbStream (duplex: Duplex<Uint8Array>, opts = {}): ProtobufStream {
  const shake = handshake(duplex)
  const lpReader = lp.decode.fromReader(
    shake.reader,
    opts
  )

  const W: ProtobufStream = {
    read: async (bytes) => {
      // just read
      const { value } = await shake.reader.next(bytes)

      if (value == null) {
        throw new Error('Value is null')
      }

      return value
    },
    readLP: async () => {
      // read, decode
      // @ts-expect-error .next is part of the generator interface
      const { value } = await lpReader.next()

      if (value == null) {
        throw new Error('Value is null')
      }

      return value
    },
    readPB: async (proto) => {
      // readLP, decode
      const value = await W.readLP()

      if (value == null) {
        throw new Error('Value is null')
      }

      // Is this a buffer?
      const buf = value instanceof Uint8Array ? value : value.slice()

      return proto.decode(buf)
    },
    write: (data) => {
      // just write
      if (data instanceof Uint8Array) {
        shake.writer.push(data)
      } else {
        shake.writer.push(data.slice())
      }
    },
    writeLP: (data) => {
      // encode, write
      W.write(lp.encode.single(data, opts))
    },
    writePB: (data, proto) => {
      // encode, writeLP
      W.writeLP(proto.encode(data))
    },
    pb: (proto) => {
      return {
        read: async () => await W.readPB(proto),
        write: (d) => W.writePB(d, proto)
      }
    },
    unwrap: () => {
      // returns vanilla duplex again, terminates all reads/writes from this object
      shake.rest()
      return shake.stream
    }
  }

  return W
}
