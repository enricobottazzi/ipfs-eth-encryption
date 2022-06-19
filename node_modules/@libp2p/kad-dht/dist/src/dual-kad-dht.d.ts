import type { KadDHT } from './kad-dht.js';
import type { DualDHT, QueryOptions } from '@libp2p/interfaces/dht';
import type { AbortOptions } from '@libp2p/interfaces';
import { EventEmitter } from '@libp2p/interfaces/events';
import type { CID } from 'multiformats';
import type { PeerId } from '@libp2p/interfaces/peer-id';
import type { PeerDiscoveryEvents } from '@libp2p/interfaces/peer-discovery';
import { Components, Initializable } from '@libp2p/interfaces/components';
import { symbol } from '@libp2p/interfaces/peer-discovery';
/**
 * A DHT implementation modelled after Kademlia with S/Kademlia modifications.
 * Original implementation in go: https://github.com/libp2p/go-libp2p-kad-dht.
 */
export declare class DualKadDHT extends EventEmitter<PeerDiscoveryEvents> implements DualDHT, Initializable {
    wan: KadDHT;
    lan: KadDHT;
    components: Components;
    constructor(wan: KadDHT, lan: KadDHT);
    get [symbol](): true;
    get [Symbol.toStringTag](): string;
    init(components: Components): void;
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
    put(key: Uint8Array, value: Uint8Array, options?: QueryOptions): AsyncGenerator<import("@libp2p/interfaces/dht").SendingQueryEvent | import("@libp2p/interfaces/dht").PeerResponseEvent | import("@libp2p/interfaces/dht").QueryErrorEvent | import("@libp2p/interfaces/dht").ProviderEvent | import("@libp2p/interfaces/dht").ValueEvent | import("@libp2p/interfaces/dht").AddingPeerEvent | import("@libp2p/interfaces/dht").DialingPeerEvent, void, unknown>;
    /**
     * Get the value that corresponds to the passed key
     */
    get(key: Uint8Array, options?: QueryOptions): AsyncGenerator<import("@libp2p/interfaces/dht").QueryEvent, void, unknown>;
    /**
     * Announce to the network that we can provide given key's value
     */
    provide(key: CID, options?: AbortOptions): AsyncGenerator<import("@libp2p/interfaces/dht").SendingQueryEvent | import("@libp2p/interfaces/dht").PeerResponseEvent | import("@libp2p/interfaces/dht").QueryErrorEvent | import("@libp2p/interfaces/dht").ProviderEvent | import("@libp2p/interfaces/dht").ValueEvent | import("@libp2p/interfaces/dht").AddingPeerEvent | import("@libp2p/interfaces/dht").DialingPeerEvent, void, unknown>;
    /**
     * Search the dht for up to `K` providers of the given CID
     */
    findProviders(key: CID, options?: QueryOptions): AsyncGenerator<import("@libp2p/interfaces/dht").QueryEvent, void, undefined>;
    /**
     * Search for a peer with the given ID
     */
    findPeer(id: PeerId, options?: QueryOptions): AsyncGenerator<import("@libp2p/interfaces/dht").QueryEvent, void, unknown>;
    /**
     * Kademlia 'node lookup' operation
     */
    getClosestPeers(key: Uint8Array, options?: QueryOptions): AsyncGenerator<import("@libp2p/interfaces/dht").QueryEvent, void, undefined>;
    refreshRoutingTable(): Promise<void>;
}
//# sourceMappingURL=dual-kad-dht.d.ts.map