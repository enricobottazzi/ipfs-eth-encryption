import type { Message } from '../message/dht.js';
import type { SendingQueryEvent, PeerResponseEvent, DialingPeerEvent, AddingPeerEvent, ValueEvent, ProviderEvent, QueryErrorEvent, FinalPeerEvent } from '@libp2p/interfaces/dht';
import type { PeerInfo } from '@libp2p/interfaces/peer-info';
import type { PeerId } from '@libp2p/interfaces/peer-id';
import type { Libp2pRecord } from '@libp2p/record';
export interface QueryEventFields {
    to: PeerId;
    type: Message.MessageType;
}
export declare function sendingQueryEvent(fields: QueryEventFields): SendingQueryEvent;
export interface PeerResponseEventField {
    from: PeerId;
    messageType: Message.MessageType;
    closer?: PeerInfo[];
    providers?: PeerInfo[];
    record?: Libp2pRecord;
}
export declare function peerResponseEvent(fields: PeerResponseEventField): PeerResponseEvent;
export interface FinalPeerEventFields {
    from: PeerId;
    peer: PeerInfo;
}
export declare function finalPeerEvent(fields: FinalPeerEventFields): FinalPeerEvent;
export interface ErrorEventFields {
    from: PeerId;
    error: Error;
}
export declare function queryErrorEvent(fields: ErrorEventFields): QueryErrorEvent;
export interface ProviderEventFields {
    from: PeerId;
    providers: PeerInfo[];
}
export declare function providerEvent(fields: ProviderEventFields): ProviderEvent;
export interface ValueEventFields {
    from: PeerId;
    value: Uint8Array;
}
export declare function valueEvent(fields: ValueEventFields): ValueEvent;
export interface PeerEventFields {
    peer: PeerId;
}
export declare function addingPeerEvent(fields: PeerEventFields): AddingPeerEvent;
export interface DialingPeerEventFields {
    peer: PeerId;
}
export declare function dialingPeerEvent(fields: DialingPeerEventFields): DialingPeerEvent;
//# sourceMappingURL=events.d.ts.map