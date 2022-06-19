import { KadDHT as SingleKadDHT } from './kad-dht.js';
import { DualKadDHT } from './dual-kad-dht.js';
export class KadDHT extends DualKadDHT {
    constructor(init) {
        super(new SingleKadDHT({
            protocolPrefix: '/ipfs',
            ...init,
            lan: false
        }), new SingleKadDHT({
            protocolPrefix: '/ipfs',
            ...init,
            clientMode: false,
            lan: true
        }));
    }
}
//# sourceMappingURL=index.js.map