import EthCrypto from 'eth-crypto';

export async function Decrypt (privateKey, cid, node) {

// Fetch the data from IPFS in buffer format
var encrypted = []
for await (const result of node.cat(cid)) {
    encrypted.push(result)
}

// Parse the buffer back to JSON
var encryptedJson = JSON.parse(encrypted.toString());

// Decrypt the message 
const message = await EthCrypto.decryptWithPrivateKey(
    privateKey, // privateKey
    encryptedJson // encrypted-data
  );

return message
}
