# it-reader

[![Build Status](https://github.com/alanshaw/it-reader/actions/workflows/js-test-and-release.yml/badge.svg?branch=master)](https://github.com/alanshaw/it-reader/actions/workflows/js-test-and-release.yml)
[![Dependencies Status](https://david-dm.org/alanshaw/it-reader/status.svg)](https://david-dm.org/alanshaw/it-reader)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

> Read an exact number of bytes from a binary (async) iterable

## Install

```sh
npm install it-reader
```

## Usage

```js
import { reader } from 'it-reader'

const stream = reader(source) // source is any iterable or async iterable
const { value, done } = await stream.next(8)

// NOTE: value is a BufferList (https://npm.im/bl)
console.log(value.toString())

// Now read 16 more bytes:
await stream.next(16)

// or...
// Consume the rest of the stream

for await (const chunk of stream) {
  console.log(chunk.toString())
}
```

## API

```js
import { reader } from 'it-reader'
```

### `reader(source)`

Create and return a new reader.

#### Parameters

* `source` (`Iterable`) - An [iterable or async iterable](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols) that yields [`Buffer`](https://npm.im/buffer) or [`BufferList`](https://npm.im/bl) objects.

#### Returns

An [async iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#The_iterator_protocol) that yields [`BufferList`](https://npm.im/bl) objects.

The iterator's `next` method takes an _optional_ parameter - the number of bytes to read from the `source`.

If the number of bytes to read are not specified, the iterator will yield any bytes remaining in the internal buffer or the next available chunk.

If the number of bytes to read exceeds the number of bytes available in the source the iterator will throw and error with a `code` property set to `'ERR_UNDER_READ'` and a `buffer` property (the bytes read so far, if any), which is a [`BufferList`](https://npm.im/bl) instance.

## Contribute

Feel free to dive in! [Open an issue](https://github.com/alanshaw/it-reader/issues/new) or submit PRs.

## License

[MIT](LICENSE) © Alan Shaw
