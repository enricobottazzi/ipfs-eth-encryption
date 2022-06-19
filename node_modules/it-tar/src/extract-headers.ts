import { Uint8ArrayList, isUint8ArrayList } from 'uint8arraylist'
import { SupportedEncodings, toString as uint8ArrayToString } from 'uint8arrays/to-string'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { compare as uint8ArrayCompare } from 'uint8arrays/compare'
import type { TarEntryHeader } from '.'

const ZERO_OFFSET = '0'.charCodeAt(0)
const USTAR_MAGIC = uint8ArrayFromString('ustar\x00', 'binary')
const GNU_MAGIC = uint8ArrayFromString('ustar\x20', 'binary')
const GNU_VER = uint8ArrayFromString('\x20\x00', 'binary')
const MAGIC_OFFSET = 257
const VERSION_OFFSET = 263

const clamp = function (index: number, len: number, defaultValue: number) {
  if (typeof index !== 'number') return defaultValue
  index = ~~index // Coerce to integer.
  if (index >= len) return len
  if (index >= 0) return index
  index += len
  if (index >= 0) return index
  return 0
}

const toType = function (flag: number) {
  switch (flag) {
    case 0:
      return 'file'
    case 1:
      return 'link'
    case 2:
      return 'symlink'
    case 3:
      return 'character-device'
    case 4:
      return 'block-device'
    case 5:
      return 'directory'
    case 6:
      return 'fifo'
    case 7:
      return 'contiguous-file'
    case 72:
      return 'pax-header'
    case 55:
      return 'pax-global-header'
    case 27:
      return 'gnu-long-link-path'
    case 28:
    case 30:
      return 'gnu-long-path'
    default:
      return undefined
  }
}

const indexOf = function (block: Uint8ArrayList, num: number, offset: number, end: number) {
  for (; offset < end; offset++) {
    if (block.get(offset) === num) return offset
  }
  return end
}

const cksum = function (block: Uint8ArrayList) {
  let sum = 8 * 32
  for (let i = 0; i < 148; i++) sum += block.get(i)
  for (let j = 156; j < 512; j++) sum += block.get(j)
  return sum
}

/* Copied from the node-tar repo and modified to meet
 * tar-stream coding standard.
 *
 * Source: https://github.com/npm/node-tar/blob/51b6627a1f357d2eb433e7378e5f05e83b7aa6cd/lib/header.js#L349
 */
function parse256 (buf: Uint8ArrayList): number {
  // first byte MUST be either 80 or FF
  // 80 for positive, FF for 2's comp
  let positive
  if (buf.get(0) === 0x80) {
    positive = true
  } else if (buf.get(0) === 0xFF) {
    positive = false
  } else {
    return 0
  }

  // build up a base-256 tuple from the least sig to the highest
  let zero = false
  const tuple = []
  for (let i = buf.length - 1; i > 0; i--) {
    const byte = buf.get(i)
    if (positive) tuple.push(byte)
    else if (zero && byte === 0) tuple.push(0)
    else if (zero) {
      zero = false
      tuple.push(0x100 - byte)
    } else tuple.push(0xFF - byte)
  }

  let sum = 0
  const l = tuple.length
  for (let i = 0; i < l; i++) {
    sum += tuple[i] * Math.pow(256, i)
  }

  return positive ? sum : -1 * sum
}

const decodeOct = function (val: Uint8ArrayList, offset: number, length: number): number {
  val = val.subarray(offset, offset + length)
  offset = 0

  // If prefixed with 0x80 then parse as a base-256 integer
  if ((val.get(offset) & 0x80) !== 0) {
    return parse256(val)
  } else {
    // Older versions of tar can prefix with spaces
    while (offset < val.length && val.get(offset) === 32) {
      offset++
    }

    const end = clamp(indexOf(val, 32, offset, val.length), val.length, val.length)

    while (offset < end && val.get(offset) === 0) {
      offset++
    }

    if (end === offset) {
      return 0
    }

    return parseInt(uint8ArrayToString(val.slice(offset, end)), 8)
  }
}

const decodeStr = function (val: Uint8ArrayList, offset: number, length: number, encoding?: SupportedEncodings) {
  return uint8ArrayToString(val.slice(offset, indexOf(val, 0, offset, offset + length)), encoding)
}

export function decodeLongPath (buf: Uint8ArrayList | Uint8Array, encoding?: SupportedEncodings) {
  const list = isUint8ArrayList(buf) ? buf : new Uint8ArrayList(buf)
  return decodeStr(list, 0, buf.length, encoding)
}

export function decodePax (buf: Uint8ArrayList | Uint8Array, encoding?: SupportedEncodings) {
  let list = isUint8ArrayList(buf) ? buf : new Uint8ArrayList(buf)
  const result: Record<string, string> = {}

  while (list.length > 0) {
    let i = 0
    while (i < buf.length && list.get(i) !== 32) {
      i++
    }

    const len = parseInt(uint8ArrayToString(list.slice(0, i)), 10)

    if (len === 0) {
      return result
    }

    const b = uint8ArrayToString(list.slice(i + 1, len - 1), encoding)
    const keyIndex = b.indexOf('=')

    if (keyIndex === -1) {
      return result
    }

    result[b.slice(0, keyIndex)] = b.slice(keyIndex + 1)
    list = list.subarray(len)
  }

  return result
}

export function decode (buf: Uint8ArrayList | Uint8Array, filenameEncoding?: SupportedEncodings): TarEntryHeader | null {
  const list = isUint8ArrayList(buf) ? buf : new Uint8ArrayList(buf)
  let typeflag = list.get(156) === 0 ? 0 : list.get(156) - ZERO_OFFSET

  let name = decodeStr(list, 0, 100, filenameEncoding)
  const mode = decodeOct(list, 100, 8)
  const uid = decodeOct(list, 108, 8)
  const gid = decodeOct(list, 116, 8)
  const size = decodeOct(list, 124, 12)
  const mtime = decodeOct(list, 136, 12)
  const type = toType(typeflag)
  const linkname = list.get(157) === 0 ? undefined : decodeStr(list, 157, 100, filenameEncoding)
  const uname = decodeStr(list, 265, 32)
  const gname = decodeStr(list, 297, 32)
  const devmajor = decodeOct(list, 329, 8)
  const devminor = decodeOct(list, 337, 8)

  const c = cksum(list)

  // checksum is still initial value if header was null.
  if (c === 8 * 32) {
    return null
  }

  // valid checksum
  if (c !== decodeOct(list, 148, 8)) {
    throw new Error('Invalid tar header. Maybe the tar is corrupted or it needs to be gunzipped?')
  }

  if (uint8ArrayCompare(USTAR_MAGIC, list.slice(MAGIC_OFFSET, MAGIC_OFFSET + 6)) === 0) {
    // ustar (posix) format.
    // prepend prefix, if present.
    if (list.get(345) !== 0) {
      name = decodeStr(list, 345, 155, filenameEncoding) + '/' + name
    }
  } else if (uint8ArrayCompare(GNU_MAGIC, list.slice(MAGIC_OFFSET, MAGIC_OFFSET + 6)) === 0 &&
             uint8ArrayCompare(GNU_VER, list.slice(VERSION_OFFSET, VERSION_OFFSET + 2)) === 0) {
    // 'gnu'/'oldgnu' format. Similar to ustar, but has support for incremental and
    // multi-volume tarballs.
  } else {
    throw new Error('Invalid tar header: unknown format.')
  }

  // to support old tar versions that use trailing / to indicate dirs
  if (typeflag === 0 && name != null && name[name.length - 1] === '/') {
    typeflag = 5
  }

  return {
    name: name,
    mode: mode,
    uid: uid,
    gid: gid,
    size: size,
    mtime: new Date(1000 * (mtime ?? 0)),
    type: type,
    linkname: linkname,
    uname: uname,
    gname: gname,
    devmajor: devmajor,
    devminor: devminor
  }
}
