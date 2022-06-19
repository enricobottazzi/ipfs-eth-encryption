import type { Source, Transform } from 'it-stream-types'
import defer from 'p-defer'
import type { Uint8ArrayList } from 'uint8arraylist'
import type { SupportedEncodings } from 'uint8arrays/to-string'
import * as Headers from './extract-headers.js'
import { lteReader } from './lte-reader.js'
import type { LteReader } from './lte-reader.js'
import type { TarEntry } from './index.js'

function getPadding (size: number) {
  size &= 511

  if (size !== 0) {
    return 512 - size
  }

  return 0
}

async function discardPadding (reader: LteReader, size: number) {
  const overflow = getPadding(size)
  if (overflow > 0) {
    await reader.next(overflow)
  }
}

export interface ExtractOptions {
  highWaterMark?: number
  filenameEncoding?: SupportedEncodings
}

export interface Derp {
  header: any
  body: Source<Uint8Array>
}

export function extract (options: ExtractOptions = {}): Transform<Uint8Array, TarEntry> {
  options.highWaterMark = options.highWaterMark ?? 1024 * 16

  return async function * (source: Source<Uint8Array>) { // eslint-disable-line complexity
    const reader = lteReader(source)
    let gnuLongPath, gnuLongLinkPath, paxGlobal, pax

    try {
      while (true) {
        let headerBytes: Uint8ArrayList
        try {
          const result = await reader.next(512)

          if (result.done === true) {
            return
          }

          headerBytes = result.value
        } catch (err: any) {
          // Is ok, this is the end of the stream!
          if (err.code === 'ERR_UNDER_READ') {
            return
          }

          throw err
        }

        const header = Headers.decode(headerBytes, options.filenameEncoding)
        if (header == null) {
          continue
        }

        if (header.type === 'gnu-long-path') {
          const { done, value: gnuLongPathBytes } = await reader.next(header.size)
          if (done === true || gnuLongPathBytes == null) {
            return
          }
          gnuLongPath = Headers.decodeLongPath(gnuLongPathBytes, options.filenameEncoding)
          await discardPadding(reader, header.size)
          continue
        }

        if (header.type === 'gnu-long-link-path') {
          const { done, value: gnuLongLinkPathBytes } = await reader.next(header.size)
          if (done === true || gnuLongLinkPathBytes == null) {
            return
          }
          gnuLongLinkPath = Headers.decodeLongPath(gnuLongLinkPathBytes, options.filenameEncoding)
          await discardPadding(reader, header.size)
          continue
        }

        if (header.type === 'pax-global-header') {
          const { done, value: paxGlobalBytes } = await reader.next(header.size)
          if (done === true || paxGlobalBytes == null) {
            return
          }
          paxGlobal = Headers.decodePax(paxGlobalBytes, options.filenameEncoding)
          await discardPadding(reader, header.size)
          continue
        }

        if (header.type === 'pax-header') {
          const { done, value: paxBytes } = await reader.next(header.size)
          if (done === true || paxBytes == null) {
            return
          }
          pax = Headers.decodePax(paxBytes, options.filenameEncoding)
          if (paxGlobal != null) {
            pax = { ...paxGlobal, ...pax }
          }
          await discardPadding(reader, header.size)
          continue
        }

        if (gnuLongPath != null) {
          header.name = gnuLongPath
          gnuLongPath = null
        }

        if (gnuLongLinkPath != null) {
          header.linkname = gnuLongLinkPath
          gnuLongLinkPath = null
        }

        if (pax != null) {
          if (pax.path != null) {
            header.name = pax.path
          }

          if (pax.linkpath != null) {
            header.linkname = pax.linkpath
          }

          if (pax.size != null) {
            header.size = parseInt(pax.size, 10)
          }

          header.pax = pax
          pax = null
        }

        if (header.size == null || header.size === 0 || header.type === 'directory') {
          yield { header, body: (async function * () {})() }
          continue
        }

        let bytesRemaining = header.size
        const bodyConsumed = defer()

        // Prefetch the first chunk.
        // This allows us to stream entries for small files from the tar without
        // explicitly streaming the body of each.
        const firstChunk = await reader.nextLte(Math.min(bytesRemaining, options.highWaterMark ?? Infinity))
        bytesRemaining -= firstChunk.value.length

        if (bytesRemaining === 0) {
          bodyConsumed.resolve()
        }

        const body: AsyncIterable<Uint8Array> = (async function * () {
          try {
            yield firstChunk.value.slice()

            while (bytesRemaining > 0) {
              const { done, value } = await reader.nextLte(bytesRemaining)

              if (done === true) {
                bytesRemaining = 0
                return
              }

              bytesRemaining -= value.length

              yield value.slice()
            }
          } finally {
            bodyConsumed.resolve()
          }
        })()

        yield { header, body }

        // Wait for the body to be consumed
        await bodyConsumed.promise

        // In case the body was not consumed entirely...
        if (bytesRemaining > 0) {
          for await (const _ of body) {} // eslint-disable-line no-unused-vars,no-empty,@typescript-eslint/no-unused-vars
        }

        await discardPadding(reader, header.size)
      }
    } finally {
      await reader.return()
    }
  }
}
