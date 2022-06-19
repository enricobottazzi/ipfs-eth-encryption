import EthCrypto from 'eth-crypto';

export async function Encrypt(message, publicKey) {

    if (typeof message === 'object') {
        var bufMessage = Buffer.from(JSON.stringify(message));

        // Encrypt message
        const encrypted = await EthCrypto.encryptWithPublicKey(
            publicKey, // publicKey
            bufMessage // message
        );

        return encrypted
    }

    else {
        // Encrypt message
        const encrypted = await EthCrypto.encryptWithPublicKey(
            publicKey, // publicKey
            message // message
        );
        return encrypted
    }

}

