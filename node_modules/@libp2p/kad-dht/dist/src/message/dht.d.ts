import type { Codec } from 'protons-runtime';
export interface Record {
    key?: Uint8Array;
    value?: Uint8Array;
    author?: Uint8Array;
    signature?: Uint8Array;
    timeReceived?: string;
}
export declare namespace Record {
    const codec: () => Codec<Record>;
    const encode: (obj: Record) => Uint8Array;
    const decode: (buf: Uint8Array) => Record;
}
export interface Message {
    type?: Message.MessageType;
    clusterLevelRaw?: number;
    key?: Uint8Array;
    record?: Uint8Array;
    closerPeers: Message.Peer[];
    providerPeers: Message.Peer[];
}
export declare namespace Message {
    enum MessageType {
        PUT_VALUE = "PUT_VALUE",
        GET_VALUE = "GET_VALUE",
        ADD_PROVIDER = "ADD_PROVIDER",
        GET_PROVIDERS = "GET_PROVIDERS",
        FIND_NODE = "FIND_NODE",
        PING = "PING"
    }
    namespace MessageType {
        const codec: () => Codec<typeof MessageType>;
    }
    enum ConnectionType {
        NOT_CONNECTED = "NOT_CONNECTED",
        CONNECTED = "CONNECTED",
        CAN_CONNECT = "CAN_CONNECT",
        CANNOT_CONNECT = "CANNOT_CONNECT"
    }
    namespace ConnectionType {
        const codec: () => Codec<typeof ConnectionType>;
    }
    interface Peer {
        id?: Uint8Array;
        addrs: Uint8Array[];
        connection?: Message.ConnectionType;
    }
    namespace Peer {
        const codec: () => Codec<Peer>;
        const encode: (obj: Peer) => Uint8Array;
        const decode: (buf: Uint8Array) => Peer;
    }
    const codec: () => Codec<Message>;
    const encode: (obj: Message) => Uint8Array;
    const decode: (buf: Uint8Array) => Message;
}
//# sourceMappingURL=dht.d.ts.map