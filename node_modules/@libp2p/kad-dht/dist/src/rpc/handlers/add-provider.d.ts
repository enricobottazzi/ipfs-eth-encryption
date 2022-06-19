import type { Providers } from '../../providers';
import type { PeerId } from '@libp2p/interfaces/peer-id';
import type { DHTMessageHandler } from '../index.js';
import type { Message } from '../../message/index.js';
import type { Initializable } from '@libp2p/interfaces/components';
export interface AddProviderHandlerInit {
    providers: Providers;
}
export declare class AddProviderHandler implements DHTMessageHandler, Initializable {
    private readonly providers;
    constructor(init: AddProviderHandlerInit);
    init(): void;
    handle(peerId: PeerId, msg: Message): Promise<undefined>;
}
//# sourceMappingURL=add-provider.d.ts.map