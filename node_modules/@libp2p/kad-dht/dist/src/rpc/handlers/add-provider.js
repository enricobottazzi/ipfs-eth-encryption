import { CID } from 'multiformats/cid';
import errcode from 'err-code';
import { logger } from '@libp2p/logger';
const log = logger('libp2p:kad-dht:rpc:handlers:add-provider');
export class AddProviderHandler {
    constructor(init) {
        const { providers } = init;
        this.providers = providers;
    }
    init() {
    }
    async handle(peerId, msg) {
        log('start');
        if (msg.key == null || msg.key.length === 0) {
            throw errcode(new Error('Missing key'), 'ERR_MISSING_KEY');
        }
        let cid;
        try {
            // this is actually just the multihash, not the whole CID
            cid = CID.decode(msg.key);
        }
        catch (err) {
            throw errcode(new Error('Invalid CID'), 'ERR_INVALID_CID');
        }
        if (msg.providerPeers == null || msg.providerPeers.length === 0) {
            log.error('no providers found in message');
        }
        await Promise.all(msg.providerPeers.map(async (pi) => {
            // Ignore providers not from the originator
            if (!pi.id.equals(peerId)) {
                log('invalid provider peer %p from %p', pi.id, peerId);
                return;
            }
            if (pi.multiaddrs.length < 1) {
                log('no valid addresses for provider %p. Ignore', peerId);
                return;
            }
            log('received provider %p for %s (addrs %s)', peerId, cid, pi.multiaddrs.map((m) => m.toString()));
            await this.providers.addProvider(cid, pi.id);
        }));
        return undefined;
    }
}
//# sourceMappingURL=add-provider.js.map