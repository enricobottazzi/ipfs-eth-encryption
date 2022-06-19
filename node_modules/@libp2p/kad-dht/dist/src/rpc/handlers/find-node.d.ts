import { Message } from '../../message/index.js';
import { Components } from '@libp2p/interfaces/components';
import type { Initializable } from '@libp2p/interfaces/components';
import type { DHTMessageHandler } from '../index.js';
import type { PeerRouting } from '../../peer-routing/index.js';
import type { PeerId } from '@libp2p/interfaces/peer-id';
export interface FindNodeHandlerInit {
    peerRouting: PeerRouting;
    lan: boolean;
}
export declare class FindNodeHandler implements DHTMessageHandler, Initializable {
    private readonly peerRouting;
    private readonly lan;
    private components;
    constructor(init: FindNodeHandlerInit);
    init(components: Components): void;
    /**
     * Process `FindNode` DHT messages
     */
    handle(peerId: PeerId, msg: Message): Promise<Message>;
}
//# sourceMappingURL=find-node.d.ts.map