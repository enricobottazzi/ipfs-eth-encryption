import type { DHTMessageHandler } from '../index.js';
import type { Validators } from '@libp2p/interfaces/dht';
import type { PeerId } from '@libp2p/interfaces/peer-id';
import type { Message } from '../../message/index.js';
import { Components, Initializable } from '@libp2p/interfaces/components';
export interface PutValueHandlerInit {
    validators: Validators;
}
export declare class PutValueHandler implements DHTMessageHandler, Initializable {
    private readonly log;
    private components;
    private readonly validators;
    constructor(init: PutValueHandlerInit);
    init(components: Components): void;
    handle(peerId: PeerId, msg: Message): Promise<Message>;
}
//# sourceMappingURL=put-value.d.ts.map