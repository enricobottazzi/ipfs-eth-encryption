import type { RoutingTable } from '../routing-table';
import type { PeerId } from '@libp2p/interfaces/peer-id';
import { Message } from '../message/index.js';
import type { IncomingStreamData } from '@libp2p/interfaces/registrar';
import type { Providers } from '../providers';
import type { PeerRouting } from '../peer-routing';
import type { Validators } from '@libp2p/interfaces/dht';
import type { Components, Initializable } from '@libp2p/interfaces/components';
export interface DHTMessageHandler extends Initializable {
    handle: (peerId: PeerId, msg: Message) => Promise<Message | undefined>;
}
export interface RPCInit {
    routingTable: RoutingTable;
    providers: Providers;
    peerRouting: PeerRouting;
    validators: Validators;
    lan: boolean;
}
export declare class RPC implements Initializable {
    private readonly handlers;
    private readonly routingTable;
    private readonly log;
    constructor(init: RPCInit);
    init(components: Components): void;
    /**
     * Process incoming DHT messages
     */
    handleMessage(peerId: PeerId, msg: Message): Promise<Message | undefined>;
    /**
     * Handle incoming streams on the dht protocol
     */
    onIncomingStream(data: IncomingStreamData): void;
}
//# sourceMappingURL=index.d.ts.map