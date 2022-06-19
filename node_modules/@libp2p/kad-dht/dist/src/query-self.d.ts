import type { PeerRouting } from './peer-routing/index.js';
import type { Startable } from '@libp2p/interfaces/startable';
import { Components, Initializable } from '@libp2p/interfaces/components';
export interface QuerySelfInit {
    lan: boolean;
    peerRouting: PeerRouting;
    count?: number;
    interval?: number;
    queryTimeout?: number;
}
/**
 * Receives notifications of new peers joining the network that support the DHT protocol
 */
export declare class QuerySelf implements Startable, Initializable {
    private readonly log;
    private components;
    private readonly peerRouting;
    private readonly count;
    private readonly interval;
    private readonly queryTimeout;
    private running;
    private timeoutId?;
    private controller?;
    constructor(init: QuerySelfInit);
    init(components: Components): void;
    isStarted(): boolean;
    start(): Promise<void>;
    stop(): Promise<void>;
    _querySelf(): void;
}
//# sourceMappingURL=query-self.d.ts.map