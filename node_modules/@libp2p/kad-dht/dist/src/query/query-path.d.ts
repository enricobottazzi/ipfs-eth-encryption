import type { PeerId } from '@libp2p/interfaces/peer-id';
import type { EventEmitter } from '@libp2p/interfaces/events';
import type { CleanUpEvents } from './manager.js';
import type { Logger } from '@libp2p/logger';
import type { QueryFunc } from '../query/types.js';
import type { QueryEvent } from '@libp2p/interfaces/dht';
export interface QueryPathOptions {
    /**
     * What are we trying to find
     */
    key: Uint8Array;
    /**
     * Where we start our query
     */
    startingPeer: PeerId;
    /**
     * Who we are
     */
    ourPeerId: PeerId;
    /**
     * When to stop querying
     */
    signal: AbortSignal;
    /**
     * The query function to run with each peer
     */
    query: QueryFunc;
    /**
     * How many concurrent node/value lookups to run
     */
    alpha: number;
    /**
     * How many concurrent node/value lookups to run
     */
    pathIndex: number;
    /**
     * How many concurrent node/value lookups to run
     */
    numPaths: number;
    /**
     * will emit a 'cleanup' event if the caller exits the for..await of early
     */
    cleanUp: EventEmitter<CleanUpEvents>;
    /**
     * A timeout for queryFunc in ms
     */
    queryFuncTimeout?: number;
    /**
     * Query log
     */
    log: Logger;
}
/**
 * Walks a path through the DHT, calling the passed query function for
 * every peer encountered that we have not seen before
 */
export declare function queryPath(options: QueryPathOptions): AsyncGenerator<QueryEvent, void, undefined>;
//# sourceMappingURL=query-path.d.ts.map