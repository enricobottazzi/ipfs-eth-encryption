# IPFS-ETH-ENCRYPTION

Store encrypted data on IPFS and control it with your Ethereum key pair. The package leverages [`eth-crypto`](https://www.npmjs.com/package/eth-crypto) for asymmetric encryption/decryption and `ipfs-js`

## Install

```bash
npm install ipfs-eth-encryption
```

## Setup

```js
import {Encrypt, UploadToIpfs, Decrypt} from "ipfs-eth-encryption"
import * as IPFS from 'ipfs-core'

async function main() {
    // Instantiate an IPFS node
    const node = await IPFS.create();
}
```

### Encrypt 

```js
const message = "Hello world!"

const publicKey = "32da4be1d1244fbb5c27ab9ff75723a7cd22fb13b0303017e30d377b88b611faa7dded7adc874452a811387e9c769dce09ec947b03e0490fa71c3b8f438be780"

const encrypted = await Encrypt(message, publicKey)

/* 
  iv: '45140d6fc370b7c70ae1d0128581d725',
  ephemPublicKey: '04500ee21c2a300a2733528fdb10f11af40054cfe62b40aed9c793868c4c940ac63fa6799b67358f2715b8f5baab0c5e56fe27cfd230bc6cb0f67bd4234f24ca51',
  ciphertext: 'aae1f5af5c06df1eef9ef6d071be54a3',
  mac: '6645de4efaa603693eb2869af4641ec123d88eb93f2f80caa7a0f18a21b045c8'
*/
```

Encrypt a message to a publicKey:

- The `message` can be a string, an array or any object 
- The `publicKey` can be [retrieved from an address and a signed message](https://piyopiyo.medium.com/how-to-get-senders-ethereum-address-and-public-key-from-signed-transaction-44abe17a1791) or [starting from a privateKey](https://github.com/pubkey/eth-crypto#publickeybyprivatekey)

### Upload to IPFS 

```js
const node = await IPFS.create();

const cid = await UploadToIpfs(encrypted, node)
// QmSfHEFgrbTaF9Xm2UCGtf8T8wstCDArwA5za6ZX84fd6q
```

### Fetch data from IPFS and Decrypt

```js
const node = await IPFS.create();

const privateKey = "0xd855f906bf500f14ad028ddb9ca6026d43f072ea759f5f870017edf504d3f6b1"

const decrypted = await Decrypt(privateKey, cid, node)
// Hello world!
```

- To decrypt a file you need to use the `privateKey` that corresponds to the `publicKey` used to encrypt the message




