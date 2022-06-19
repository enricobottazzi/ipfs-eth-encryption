import type { PeerId } from '@libp2p/interfaces/peer-id';
import type { Startable } from '@libp2p/interfaces/startable';
import type { QueryFunc } from './types.js';
import type { QueryOptions } from '@libp2p/interfaces/dht';
import { Components, Initializable } from '@libp2p/interfaces/components';
export interface CleanUpEvents {
    'cleanup': CustomEvent;
}
export interface QueryManagerInit {
    lan?: boolean;
    disjointPaths?: number;
    alpha?: number;
}
/**
 * Keeps track of all running queries
 */
export declare class QueryManager implements Startable, Initializable {
    private components;
    private readonly lan;
    disjointPaths: number;
    private readonly alpha;
    private readonly controllers;
    private running;
    private queries;
    constructor(init: QueryManagerInit);
    init(components: Components): void;
    isStarted(): boolean;
    /**
     * Starts the query manager
     */
    start(): Promise<void>;
    /**
     * Stops all queries
     */
    stop(): Promise<void>;
    run(key: Uint8Array, peers: PeerId[], queryFunc: QueryFunc, options?: QueryOptions): AsyncGenerator<import("@libp2p/interfaces/dht").QueryEvent, void, unknown>;
}
//# sourceMappingURL=manager.d.ts.map