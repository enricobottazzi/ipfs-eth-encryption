export async function UploadToIpfs(encrypted, node) {

    // Create a buffer from the encrypted data, necessary to upload to IPFS
    var buf = Buffer.from(JSON.stringify(encrypted));

    // Add it to IPFS
    const ipfsContent = await node.add(buf)

    console.log("uploaded to IPFS with cid: " + ipfsContent.cid)

    return ipfsContent.path

}