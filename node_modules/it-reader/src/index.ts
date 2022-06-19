import { Uint8ArrayList } from 'uint8arraylist'
import type { Source } from 'it-stream-types'

export interface Reader extends AsyncGenerator<Uint8ArrayList, void, any> {
  next: (...args: [] | [number | undefined]) => Promise<IteratorResult<Uint8ArrayList, void>>
}

export function reader (source: Source<Uint8Array>) {
  const reader: Reader = (async function * (): AsyncGenerator<Uint8ArrayList, void, any> {
    // @ts-expect-error first yield in stream is ignored
    let bytes: number | undefined = yield // Allows us to receive 8 when reader.next(8) is called
    let bl = new Uint8ArrayList()

    for await (const chunk of source) {
      if (bytes == null) {
        bl.append(chunk)
        bytes = yield bl
        bl = new Uint8ArrayList()
        continue
      }

      bl.append(chunk)

      while (bl.length >= bytes) {
        const data = bl.subarray(0, bytes)
        bl.consume(bytes)
        bytes = yield data

        // If we no longer want a specific byte length, we yield the rest now
        if (bytes == null) {
          if (bl.length > 0) {
            bytes = yield bl
            bl = new Uint8ArrayList()
          }
          break // bytes is null and/or no more buffer to yield
        }
      }
    }

    // Consumer wants more bytes but the source has ended and our buffer
    // is not big enough to satisfy.
    if (bytes != null) {
      throw Object.assign(
        new Error(`stream ended before ${bytes} bytes became available`),
        { code: 'ERR_UNDER_READ', buffer: bl }
      )
    }
  })()

  void reader.next()
  return reader
}
