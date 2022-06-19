import { Libp2pRecord } from '@libp2p/record';
import { Message } from '../../message/index.js';
import type { DHTMessageHandler } from '../index.js';
import type { PeerId } from '@libp2p/interfaces/peer-id';
import type { PeerRouting } from '../../peer-routing/index.js';
import { Components, Initializable } from '@libp2p/interfaces/components';
export interface GetValueHandlerInit {
    peerRouting: PeerRouting;
}
export declare class GetValueHandler implements DHTMessageHandler, Initializable {
    private components;
    private readonly peerRouting;
    constructor(init: GetValueHandlerInit);
    init(components: Components): void;
    handle(peerId: PeerId, msg: Message): Promise<Message>;
    /**
     * Try to fetch a given record by from the local datastore.
     * Returns the record iff it is still valid, meaning
     * - it was either authored by this node, or
     * - it was received less than `MAX_RECORD_AGE` ago.
     */
    _checkLocalDatastore(key: Uint8Array): Promise<Libp2pRecord | undefined>;
}
//# sourceMappingURL=get-value.d.ts.map