import { createTopology } from '@libp2p/topology';
import { CustomEvent, EventEmitter } from '@libp2p/interfaces/events';
import { logger } from '@libp2p/logger';
import { Components } from '@libp2p/interfaces/components';
/**
 * Receives notifications of new peers joining the network that support the DHT protocol
 */
export class TopologyListener extends EventEmitter {
    constructor(init) {
        super();
        this.components = new Components();
        const { protocol, lan } = init;
        this.log = logger(`libp2p:kad-dht:topology-listener:${lan ? 'lan' : 'wan'}`);
        this.running = false;
        this.protocol = protocol;
    }
    init(components) {
        this.components = components;
    }
    isStarted() {
        return this.running;
    }
    /**
     * Start the network
     */
    async start() {
        if (this.running) {
            return;
        }
        this.running = true;
        // register protocol with topology
        const topology = createTopology({
            onConnect: (peerId) => {
                this.log('observed peer %p with protocol %s', peerId, this.protocol);
                this.dispatchEvent(new CustomEvent('peer', {
                    detail: peerId
                }));
            }
        });
        this.registrarId = await this.components.getRegistrar().register(this.protocol, topology);
    }
    /**
     * Stop all network activity
     */
    stop() {
        this.running = false;
        // unregister protocol and handlers
        if (this.registrarId != null) {
            this.components.getRegistrar().unregister(this.registrarId);
            this.registrarId = undefined;
        }
    }
}
//# sourceMappingURL=topology-listener.js.map