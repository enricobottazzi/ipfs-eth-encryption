import { EventEmitter } from '@libp2p/interfaces/events';
import type { Startable } from '@libp2p/interfaces/startable';
import type { PeerId } from '@libp2p/interfaces/peer-id';
import { Components, Initializable } from '@libp2p/interfaces/components';
export interface TopologyListenerInit {
    protocol: string;
    lan: boolean;
}
export interface TopologyListenerEvents {
    'peer': CustomEvent<PeerId>;
}
/**
 * Receives notifications of new peers joining the network that support the DHT protocol
 */
export declare class TopologyListener extends EventEmitter<TopologyListenerEvents> implements Startable, Initializable {
    private readonly log;
    private components;
    private readonly protocol;
    private running;
    private registrarId?;
    constructor(init: TopologyListenerInit);
    init(components: Components): void;
    isStarted(): boolean;
    /**
     * Start the network
     */
    start(): Promise<void>;
    /**
     * Stop all network activity
     */
    stop(): void;
}
//# sourceMappingURL=topology-listener.d.ts.map