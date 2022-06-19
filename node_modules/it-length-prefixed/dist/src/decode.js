import { Uint8ArrayList } from 'uint8arraylist';
import { varintDecode } from './varint-decode.js';
import errCode from 'err-code';
// Maximum length of the length section of the message
export const MAX_LENGTH_LENGTH = 8; // Varint.encode(Number.MAX_SAFE_INTEGER).length
// Maximum length of the data section of the message
export const MAX_DATA_LENGTH = 1024 * 1024 * 4;
const empty = new Uint8ArrayList();
const ReadModes = { LENGTH: 'readLength', DATA: 'readData' };
const ReadHandlers = {
    [ReadModes.LENGTH]: (chunk, buffer, state, options) => {
        const lengthDecoder = options?.lengthDecoder ?? varintDecode;
        const maxLengthLength = options?.maxLengthLength ?? MAX_LENGTH_LENGTH;
        const maxDataLength = options?.maxDataLength ?? MAX_DATA_LENGTH;
        // console.log(ReadModes.LENGTH, chunk.length)
        buffer.append(chunk);
        let dataLength;
        try {
            dataLength = lengthDecoder(buffer.slice());
        }
        catch (err) {
            if (buffer.length > maxLengthLength) {
                throw errCode(new Error('message length too long'), 'ERR_MSG_LENGTH_TOO_LONG');
            }
            if (err instanceof RangeError) {
                return { mode: ReadModes.LENGTH, buffer, chunk: undefined, state: undefined, data: undefined };
            }
            throw err;
        }
        if (dataLength > maxDataLength) {
            throw errCode(new Error('message data too long'), 'ERR_MSG_DATA_TOO_LONG');
        }
        chunk = buffer.subarray(lengthDecoder.bytes);
        buffer = new Uint8ArrayList();
        if (options?.onLength != null) {
            options.onLength(dataLength);
        }
        if (dataLength <= 0) {
            return { mode: ReadModes.LENGTH, chunk, buffer, data: empty };
        }
        return { mode: ReadModes.DATA, chunk, buffer, state: { dataLength }, data: undefined };
    },
    [ReadModes.DATA]: (chunk, buffer, state, options) => {
        buffer.append(chunk);
        if (state == null) {
            throw new Error('state is required');
        }
        if (buffer.length < state.dataLength) {
            return { mode: ReadModes.DATA, buffer, state, chunk: undefined, data: undefined };
        }
        const { dataLength } = state;
        const data = buffer.subarray(0, dataLength);
        const nextChunk = buffer.length > dataLength ? buffer.subarray(dataLength) : undefined;
        buffer = new Uint8ArrayList();
        return { mode: ReadModes.LENGTH, chunk: nextChunk, buffer, state: undefined, data };
    }
};
export function decode(options) {
    const decoder = async function* (source) {
        let buffer = new Uint8ArrayList();
        let mode = ReadModes.LENGTH; // current parsing mode
        let state; // accumulated state for the current mode
        for await (const chunk of source) {
            let nextChunk = new Uint8ArrayList(chunk);
            // Each chunk may contain multiple messages - keep calling handler for the
            // current parsing mode until all handlers have consumed the chunk.
            while (nextChunk != null) {
                const result = ReadHandlers[mode](nextChunk, buffer, state, options);
                mode = result.mode;
                nextChunk = result.chunk;
                buffer = result.buffer;
                state = result.state;
                if (result.data != null) {
                    const data = result.data.slice();
                    if (options?.onData != null) {
                        options.onData(data);
                    }
                    yield data;
                }
            }
        }
        if (buffer.length > 0) {
            throw errCode(new Error('unexpected end of input'), 'ERR_UNEXPECTED_EOF');
        }
    };
    return decoder;
}
/**
 * @param {*} reader
 * @param {import('./types').DecoderOptions} [options]
 * @returns
 */
decode.fromReader = (reader, options) => {
    let byteLength = 1; // Read single byte chunks until the length is known
    const varByteSource = (async function* () {
        while (true) {
            try {
                const { done, value } = await reader.next(byteLength);
                if (done === true) {
                    return;
                }
                if (value != null) {
                    yield value;
                }
            }
            catch (err) {
                if (err.code === 'ERR_UNDER_READ') {
                    return { done: true, value: null };
                }
                throw err;
            }
            finally {
                // Reset the byteLength so we continue to check for varints
                byteLength = 1;
            }
        }
    }());
    /**
     * Once the length has been parsed, read chunk for that length
     */
    const onLength = (l) => { byteLength = l; };
    return decode({
        ...(options ?? {}),
        onLength
    })(varByteSource);
};
//# sourceMappingURL=decode.js.map