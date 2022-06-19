// @ts-expect-error no types
import isoConstants from 'iso-constants'
import toBuffer from 'it-to-buffer'
import { isUint8ArrayList, Uint8ArrayList } from 'uint8arraylist'
import type { TarEntryHeader, TarImportCandidate } from './index.js'
import * as Headers from './pack-headers.js'
import type { Source, Transform } from 'it-stream-types'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'

const { S_IFMT, S_IFBLK, S_IFCHR, S_IFDIR, S_IFIFO, S_IFLNK } = isoConstants
const DMODE = parseInt('755', 8)
const FMODE = parseInt('644', 8)
const END_OF_TAR = new Uint8Array(1024)

function modeToType (mode: number = 0) {
  switch (mode & S_IFMT) {
    case S_IFBLK: return 'block-device'
    case S_IFCHR: return 'character-device'
    case S_IFDIR: return 'directory'
    case S_IFIFO: return 'fifo'
    case S_IFLNK: return 'symlink'
    default: return 'file'
  }
}

function getPadding (size: number) {
  size &= 511

  if (size !== 0) {
    return END_OF_TAR.slice(0, 512 - size)
  }

  return new Uint8Array(0)
}

function encode (header: TarEntryHeader) {
  if (header.pax == null) {
    const encoded = Headers.encode(header)

    if (encoded != null) {
      return encoded
    }
  }
  return encodePax(header)
}

function encodePax (header: TarEntryHeader) {
  const paxHeader = Headers.encodePax(header)

  const newHeader: TarEntryHeader = {
    name: 'PaxHeader',
    mode: header.mode,
    uid: header.uid,
    gid: header.gid,
    size: paxHeader.length,
    mtime: header.mtime,
    type: 'pax-header',
    linkname: header.linkname,
    uname: header.uname,
    gname: header.gname,
    devmajor: header.devmajor,
    devminor: header.devminor
  }

  return new Uint8ArrayList(
    Headers.encode(newHeader) ?? new Uint8Array(0),
    paxHeader,
    getPadding(paxHeader.length),
    Headers.encode({ ...newHeader, size: header.size, type: header.type }) ?? new Uint8Array(0)
  ).slice()
}

export function pack (): Transform<TarImportCandidate, Uint8Array> {
  return async function * (source: Source<TarImportCandidate>) { // eslint-disable-line complexity
    for await (let { header: partialHeader, body } of source) {
      const header: TarEntryHeader = {
        ...partialHeader,
        size: partialHeader.type === 'symlink' ? 0 : partialHeader.size ?? 0,
        type: partialHeader.type ?? modeToType(partialHeader.mode),
        mode: partialHeader.mode ?? (partialHeader.type === 'directory' ? DMODE : FMODE),
        uid: partialHeader.uid ?? 0,
        gid: partialHeader.gid ?? 0,
        mtime: partialHeader.mtime ?? new Date()
      }

      if (typeof body === 'string') {
        body = uint8ArrayFromString(body)
      }

      if (body instanceof Uint8Array || isUint8ArrayList(body)) {
        header.size = body.length

        yield encode(header)
        yield isUint8ArrayList(body) ? body.slice() : body
        yield getPadding(header.size)

        continue
      }

      if (header.type === 'symlink' && header.linkname == null) {
        if (body == null) {
          throw new Error('type was symlink but no linkname or body specified')
        }

        header.linkname = uint8ArrayToString(await toBuffer(body))
        yield encode(header)
        continue
      }

      yield encode(header)

      if (header.type !== 'file' && header.type !== 'contiguous-file') {
        continue
      }

      let written = 0
      for await (const chunk of (body ?? [])) {
        written += chunk.length // eslint-disable-line @typescript-eslint/restrict-plus-operands
        yield isUint8ArrayList(chunk) ? chunk.slice() : chunk
      }

      if (written !== header.size) { // corrupting tar
        throw new Error(`size mismatch, wrote ${written} of ${header.size} bytes`)
      }

      yield getPadding(header.size)
    }

    yield END_OF_TAR
  }
}
