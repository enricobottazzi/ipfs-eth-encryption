import { handshake } from 'it-handshake';
import * as lp from 'it-length-prefixed';
export function pbStream(duplex, opts = {}) {
    const shake = handshake(duplex);
    const lpReader = lp.decode.fromReader(shake.reader, opts);
    const W = {
        read: async (bytes) => {
            // just read
            const { value } = await shake.reader.next(bytes);
            if (value == null) {
                throw new Error('Value is null');
            }
            return value;
        },
        readLP: async () => {
            // read, decode
            // @ts-expect-error .next is part of the generator interface
            const { value } = await lpReader.next();
            if (value == null) {
                throw new Error('Value is null');
            }
            return value;
        },
        readPB: async (proto) => {
            // readLP, decode
            const value = await W.readLP();
            if (value == null) {
                throw new Error('Value is null');
            }
            // Is this a buffer?
            const buf = value instanceof Uint8Array ? value : value.slice();
            return proto.decode(buf);
        },
        write: (data) => {
            // just write
            if (data instanceof Uint8Array) {
                shake.writer.push(data);
            }
            else {
                shake.writer.push(data.slice());
            }
        },
        writeLP: (data) => {
            // encode, write
            W.write(lp.encode.single(data, opts));
        },
        writePB: (data, proto) => {
            // encode, writeLP
            W.writeLP(proto.encode(data));
        },
        pb: (proto) => {
            return {
                read: async () => await W.readPB(proto),
                write: (d) => W.writePB(d, proto)
            };
        },
        unwrap: () => {
            // returns vanilla duplex again, terminates all reads/writes from this object
            shake.rest();
            return shake.stream;
        }
    };
    return W;
}
//# sourceMappingURL=index.js.map