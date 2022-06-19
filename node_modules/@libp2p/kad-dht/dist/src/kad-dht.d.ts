import { RoutingTable } from './routing-table/index.js';
import { Network } from './network.js';
import { PeerRouting } from './peer-routing/index.js';
import { Providers } from './providers.js';
import type { QueryOptions, DHT } from '@libp2p/interfaces/dht';
import type { PeerInfo } from '@libp2p/interfaces/peer-info';
import { EventEmitter } from '@libp2p/interfaces/events';
import type { PeerId } from '@libp2p/interfaces/peer-id';
import type { CID } from 'multiformats/cid';
import type { PeerDiscoveryEvents } from '@libp2p/interfaces/peer-discovery';
import { Components, Initializable } from '@libp2p/interfaces/components';
import type { KadDHTInit } from './index.js';
import { symbol } from '@libp2p/interfaces/peer-discovery';
export interface SingleKadDHTInit extends KadDHTInit {
    /**
     * Whether to start up in lan or wan mode
     */
    lan?: boolean;
}
/**
 * A DHT implementation modelled after Kademlia with S/Kademlia modifications.
 * Original implementation in go: https://github.com/libp2p/go-libp2p-kad-dht.
 */
export declare class KadDHT extends EventEmitter<PeerDiscoveryEvents> implements DHT, Initializable {
    protocol: string;
    routingTable: RoutingTable;
    providers: Providers;
    network: Network;
    peerRouting: PeerRouting;
    components: Components;
    private readonly log;
    private running;
    private readonly kBucketSize;
    private clientMode;
    private readonly lan;
    private readonly validators;
    private readonly selectors;
    private readonly queryManager;
    private readonly contentFetching;
    private readonly contentRouting;
    private readonly routingTableRefresh;
    private readonly rpc;
    private readonly topologyListener;
    private readonly querySelf;
    /**
     * Create a new KadDHT
     */
    constructor(init: SingleKadDHTInit);
    get [symbol](): true;
    get [Symbol.toStringTag](): string;
    init(components: Components): void;
    onPeerConnect(peerData: PeerInfo): Promise<void>;
    /**
     * Is this DHT running.
     */
    isStarted(): boolean;
    /**
     * If 'server' this node will respond to DHT queries, if 'client' this node will not
     */
    getMode(): Promise<"client" | "server">;
    /**
     * If 'server' this node will respond to DHT queries, if 'client' this node will not
     */
    setMode(mode: 'client' | 'server'): Promise<void>;
    /**
     * Start listening to incoming connections.
     */
    start(): Promise<void>;
    /**
     * Stop accepting incoming connections and sending outgoing
     * messages.
     */
    stop(): Promise<void>;
    /**
     * Store the given key/value pair in the DHT
     */
    put(key: Uint8Array, value: Uint8Array, options?: QueryOptions): AsyncGenerator<import("@libp2p/interfaces/dht").SendingQueryEvent | import("@libp2p/interfaces/dht").PeerResponseEvent | import("@libp2p/interfaces/dht").QueryErrorEvent | import("@libp2p/interfaces/dht").ProviderEvent | import("@libp2p/interfaces/dht").ValueEvent | import("@libp2p/interfaces/dht").AddingPeerEvent | import("@libp2p/interfaces/dht").DialingPeerEvent, void, undefined>;
    /**
     * Get the value that corresponds to the passed key
     */
    get(key: Uint8Array, options?: QueryOptions): AsyncGenerator<import("@libp2p/interfaces/dht").QueryEvent, void, unknown>;
    /**
     * Announce to the network that we can provide given key's value
     */
    provide(key: CID, options?: QueryOptions): AsyncGenerator<import("@libp2p/interfaces/dht").SendingQueryEvent | import("@libp2p/interfaces/dht").PeerResponseEvent | import("@libp2p/interfaces/dht").QueryErrorEvent | import("@libp2p/interfaces/dht").ProviderEvent | import("@libp2p/interfaces/dht").ValueEvent | import("@libp2p/interfaces/dht").AddingPeerEvent | import("@libp2p/interfaces/dht").DialingPeerEvent, void, undefined>;
    /**
     * Search the dht for providers of the given CID
     */
    findProviders(key: CID, options?: QueryOptions): AsyncGenerator<import("@libp2p/interfaces/dht").QueryEvent, void, unknown>;
    /**
     * Search for a peer with the given ID
     */
    findPeer(id: PeerId, options?: QueryOptions): AsyncGenerator<import("@libp2p/interfaces/dht").QueryEvent, void, unknown>;
    /**
     * Kademlia 'node lookup' operation
     */
    getClosestPeers(key: Uint8Array, options?: QueryOptions): AsyncGenerator<import("@libp2p/interfaces/dht").QueryEvent, void, unknown>;
    refreshRoutingTable(): Promise<void>;
}
//# sourceMappingURL=kad-dht.d.ts.map