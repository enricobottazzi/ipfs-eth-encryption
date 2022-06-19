# js-libp2p-webrtc-peer <!-- omit in toc -->

[![Coverage Status](https://coveralls.io/repos/github/libp2p/js-libp2p-webrtc-peer/badge.svg?branch=master)](https://coveralls.io/github/libp2p/js-libp2p-webrtc-peer?branch=master)
[![Build Status](https://github.com/libp2p/js-libp2p-webrtc-peer/actions/workflows/js-test-and-release.yml/badge.svg?branch=main)](https://github.com/libp2p/js-libp2p-webrtc-peer/actions/workflows/js-test-and-release.yml)

> Simple one-to-one WebRTC data channels

## Table of Contents <!-- omit in toc -->

- [Install](#install)
- [Usage](#usage)
- [License](#license)
  - [Contribution](#contribution)

## Install

```sh
> npm i @libp2p/webrtc-peer
```

## Usage

```js
import { WebRTCInitiator } from '@libp2p/webrtc-peer'

const channel = new WebRTCInitiator(channelOptions)
channel.addEventListener('signal', (signal) => {
  // do handshake
})
```

## License

Licensed under either of

 * Apache 2.0, ([LICENSE-APACHE](LICENSE-APACHE) / http://www.apache.org/licenses/LICENSE-2.0)
 * MIT ([LICENSE-MIT](LICENSE-MIT) / http://opensource.org/licenses/MIT)

### Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted for inclusion in the work by you, as defined in the Apache-2.0 license, shall be dual licensed as above, without any additional terms or conditions.
