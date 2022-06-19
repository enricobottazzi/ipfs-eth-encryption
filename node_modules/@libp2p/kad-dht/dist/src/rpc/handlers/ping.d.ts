import type { Message } from '../../message/index.js';
import type { DHTMessageHandler } from '../index.js';
import type { PeerId } from '@libp2p/interfaces/peer-id';
import type { Initializable } from '@libp2p/interfaces/components';
export declare class PingHandler implements DHTMessageHandler, Initializable {
    handle(peerId: PeerId, msg: Message): Promise<Message>;
    init(): void;
}
//# sourceMappingURL=ping.d.ts.map