import Queue from 'p-queue';
import type { PeerId } from '@libp2p/interfaces/peer-id';
import type { Startable } from '@libp2p/interfaces/startable';
import { Components, Initializable } from '@libp2p/interfaces/components';
export interface KBucketPeer {
    id: Uint8Array;
    peer: PeerId;
}
export interface KBucket {
    id: Uint8Array;
    contacts: KBucketPeer[];
    dontSplit: boolean;
    left: KBucket;
    right: KBucket;
}
export interface KBucketTree {
    root: KBucket;
    localNodeId: Uint8Array;
    on: (event: 'ping', callback: (oldContacts: KBucketPeer[], newContact: KBucketPeer) => void) => void;
    closest: (key: Uint8Array, count: number) => KBucketPeer[];
    closestPeer: (key: Uint8Array) => KBucketPeer;
    remove: (key: Uint8Array) => void;
    add: (peer: KBucketPeer) => void;
    get: (key: Uint8Array) => Uint8Array;
    count: () => number;
    toIterable: () => Iterable<KBucket>;
}
export interface RoutingTableInit {
    lan: boolean;
    protocol: string;
    kBucketSize?: number;
    pingTimeout?: number;
    pingConcurrency?: number;
}
/**
 * A wrapper around `k-bucket`, to provide easy store and
 * retrieval for peers.
 */
export declare class RoutingTable implements Startable, Initializable {
    kBucketSize: number;
    kb?: KBucketTree;
    pingQueue: Queue;
    private readonly log;
    private components;
    private readonly lan;
    private readonly pingTimeout;
    private readonly pingConcurrency;
    private running;
    private readonly protocol;
    constructor(init: RoutingTableInit);
    init(components: Components): void;
    isStarted(): boolean;
    start(): Promise<void>;
    stop(): Promise<void>;
    /**
     * Called on the `ping` event from `k-bucket` when a bucket is full
     * and cannot split.
     *
     * `oldContacts.length` is defined by the `numberOfNodesToPing` param
     * passed to the `k-bucket` constructor.
     *
     * `oldContacts` will not be empty and is the list of contacts that
     * have not been contacted for the longest.
     */
    _onPing(oldContacts: KBucketPeer[], newContact: KBucketPeer): void;
    /**
     * Amount of currently stored peers
     */
    get size(): number;
    /**
     * Find a specific peer by id
     */
    find(peer: PeerId): Promise<PeerId | undefined>;
    /**
     * Retrieve the closest peers to the given key
     */
    closestPeer(key: Uint8Array): PeerId | undefined;
    /**
     * Retrieve the `count`-closest peers to the given key
     */
    closestPeers(key: Uint8Array, count?: number): PeerId[];
    /**
     * Add or update the routing table with the given peer
     */
    add(peer: PeerId): Promise<void>;
    /**
     * Remove a given peer from the table
     */
    remove(peer: PeerId): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map