# it-pb-stream <!-- omit in toc -->

[![Build Status](https://github.com/achingbrain/it-pb-stream/actions/workflows/js-test-and-release.yml/badge.svg?branch=main)](https://github.com/achingbrain/it-pb-stream/actions/workflows/js-test-and-release.yml)

> A convinience-wrapper arround protocol-buffers and lp-messages functions

- [Install](#install)
  - [npm](#npm)
- [Usage](#usage)
- [License](#license)

## Install

### npm

```sh
> npm install it-pb-stream
```

## Usage

```js
import { pbStream } from 'it-pb-stream'

const stream = pbStream(duplex)
stream.writeLP(buf)
stream.writePB(buf, def)
//.. etc
```

## License

Licensed under either of

 * Apache 2.0, ([LICENSE-APACHE](LICENSE-APACHE) / http://www.apache.org/licenses/LICENSE-2.0)
 * MIT ([LICENSE-MIT](LICENSE-MIT) / http://opensource.org/licenses/MIT)
