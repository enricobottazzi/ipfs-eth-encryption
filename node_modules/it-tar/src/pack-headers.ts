import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import type { EntryType, TarEntryHeader } from '.'

const ZEROS = '0000000000000000000'
const SEVENS = '7777777777777777777'
const ZERO_OFFSET = '0'.charCodeAt(0)
const USTAR_MAGIC = uint8ArrayFromString('ustar\x00', 'binary')
const USTAR_VER = uint8ArrayFromString('00', 'binary')
const MASK = parseInt('7777', 8)
const MAGIC_OFFSET = 257
const VERSION_OFFSET = 263

const toTypeflag = function (flag?: EntryType) {
  switch (flag) {
    case 'file':
      return 0
    case 'link':
      return 1
    case 'symlink':
      return 2
    case 'character-device':
      return 3
    case 'block-device':
      return 4
    case 'directory':
      return 5
    case 'fifo':
      return 6
    case 'contiguous-file':
      return 7
    case 'pax-header':
      return 72
    default:
      return 0
  }
}

const cksum = function (block: Uint8Array) {
  let sum = 8 * 32
  for (let i = 0; i < 148; i++) sum += block[i]
  for (let j = 156; j < 512; j++) sum += block[j]
  return sum
}

const encodeOct = function (val: number, n: number): Uint8Array {
  const str = val.toString(8)

  if (str.length > n) {
    return uint8ArrayFromString(SEVENS.slice(0, n) + ' ')
  }

  return uint8ArrayFromString(ZEROS.slice(0, n - str.length) + str + ' ')
}

const addLength = function (str: string) {
  const len = uint8ArrayFromString(str).byteLength
  let digits = Math.floor(Math.log(len) / Math.log(10)) + 1

  if (len + digits >= Math.pow(10, digits)) {
    digits++
  }

  return `${len + digits}${str}`
}

export function encodePax (opts: TarEntryHeader) { // TODO: encode more stuff in pax
  let result = ''
  if (opts.name != null) {
    result += addLength(' path=' + opts.name + '\n')
  }
  if (opts.linkname != null) {
    result += addLength(' linkpath=' + opts.linkname + '\n')
  }

  const pax = opts.pax

  if (pax != null) {
    for (const key in pax) {
      if (Object.prototype.hasOwnProperty.call(pax, key)) {
        result += addLength(' ' + key + '=' + pax[key] + '\n')
      }
    }
  }

  return uint8ArrayFromString(result)
}

export function encode (opts: TarEntryHeader): Uint8Array | null {
  const buf = new Uint8Array(512)
  let name = opts.name
  let prefix = ''

  if (opts.typeflag === 5 && name[name.length - 1] !== '/') {
    name += '/'
  }

  if (uint8ArrayFromString(name).byteLength !== name.length) {
    return null // utf-8
  }

  while (uint8ArrayFromString(name).byteLength > 100) {
    const i = name.indexOf('/')
    if (i === -1) {
      return null
    }
    prefix += prefix !== '' ? '/' + name.slice(0, i) : name.slice(0, i)
    name = name.slice(i + 1)
  }

  if (uint8ArrayFromString(name).byteLength > 100 || uint8ArrayFromString(prefix).byteLength > 155) {
    return null
  }

  if (opts.linkname != null && uint8ArrayFromString(opts.linkname).byteLength > 100) {
    return null
  }

  buf.set(uint8ArrayFromString(name), 0)
  buf.set(encodeOct(opts.mode & MASK, 6), 100)
  buf.set(encodeOct(opts.uid, 6), 108)
  buf.set(encodeOct(opts.gid, 6), 116)
  buf.set(encodeOct(opts.size, 11), 124)
  buf.set(encodeOct((opts.mtime.getTime() / 1000) | 0, 11), 136)

  buf[156] = ZERO_OFFSET + toTypeflag(opts.type)

  if (opts.linkname != null) {
    buf.set(uint8ArrayFromString(opts.linkname), 157)
  }

  buf.set(USTAR_MAGIC, MAGIC_OFFSET)
  buf.set(USTAR_VER, VERSION_OFFSET)

  if (opts.uname != null) {
    buf.set(uint8ArrayFromString(opts.uname), 265)
  }

  if (opts.gname != null) {
    buf.set(uint8ArrayFromString(opts.gname), 297)
  }

  buf.set(encodeOct(opts.devmajor ?? 0, 6), 329)
  buf.set(encodeOct(opts.devminor ?? 0, 6), 337)

  if (prefix != null) {
    buf.set(uint8ArrayFromString(prefix), 345)
  }

  buf.set(encodeOct(cksum(buf), 6), 148)

  return buf
}
