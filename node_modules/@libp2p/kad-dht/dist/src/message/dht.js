/* eslint-disable import/export */
/* eslint-disable @typescript-eslint/no-namespace */
import { encodeMessage, decodeMessage, message, bytes, string, enumeration, int32 } from 'protons-runtime';
export var Record;
(function (Record) {
    Record.codec = () => {
        return message({
            1: { name: 'key', codec: bytes, optional: true },
            2: { name: 'value', codec: bytes, optional: true },
            3: { name: 'author', codec: bytes, optional: true },
            4: { name: 'signature', codec: bytes, optional: true },
            5: { name: 'timeReceived', codec: string, optional: true }
        });
    };
    Record.encode = (obj) => {
        return encodeMessage(obj, Record.codec());
    };
    Record.decode = (buf) => {
        return decodeMessage(buf, Record.codec());
    };
})(Record || (Record = {}));
export var Message;
(function (Message) {
    let MessageType;
    (function (MessageType) {
        MessageType["PUT_VALUE"] = "PUT_VALUE";
        MessageType["GET_VALUE"] = "GET_VALUE";
        MessageType["ADD_PROVIDER"] = "ADD_PROVIDER";
        MessageType["GET_PROVIDERS"] = "GET_PROVIDERS";
        MessageType["FIND_NODE"] = "FIND_NODE";
        MessageType["PING"] = "PING";
    })(MessageType = Message.MessageType || (Message.MessageType = {}));
    let __MessageTypeValues;
    (function (__MessageTypeValues) {
        __MessageTypeValues[__MessageTypeValues["PUT_VALUE"] = 0] = "PUT_VALUE";
        __MessageTypeValues[__MessageTypeValues["GET_VALUE"] = 1] = "GET_VALUE";
        __MessageTypeValues[__MessageTypeValues["ADD_PROVIDER"] = 2] = "ADD_PROVIDER";
        __MessageTypeValues[__MessageTypeValues["GET_PROVIDERS"] = 3] = "GET_PROVIDERS";
        __MessageTypeValues[__MessageTypeValues["FIND_NODE"] = 4] = "FIND_NODE";
        __MessageTypeValues[__MessageTypeValues["PING"] = 5] = "PING";
    })(__MessageTypeValues || (__MessageTypeValues = {}));
    (function (MessageType) {
        MessageType.codec = () => {
            return enumeration(__MessageTypeValues);
        };
    })(MessageType = Message.MessageType || (Message.MessageType = {}));
    let ConnectionType;
    (function (ConnectionType) {
        ConnectionType["NOT_CONNECTED"] = "NOT_CONNECTED";
        ConnectionType["CONNECTED"] = "CONNECTED";
        ConnectionType["CAN_CONNECT"] = "CAN_CONNECT";
        ConnectionType["CANNOT_CONNECT"] = "CANNOT_CONNECT";
    })(ConnectionType = Message.ConnectionType || (Message.ConnectionType = {}));
    let __ConnectionTypeValues;
    (function (__ConnectionTypeValues) {
        __ConnectionTypeValues[__ConnectionTypeValues["NOT_CONNECTED"] = 0] = "NOT_CONNECTED";
        __ConnectionTypeValues[__ConnectionTypeValues["CONNECTED"] = 1] = "CONNECTED";
        __ConnectionTypeValues[__ConnectionTypeValues["CAN_CONNECT"] = 2] = "CAN_CONNECT";
        __ConnectionTypeValues[__ConnectionTypeValues["CANNOT_CONNECT"] = 3] = "CANNOT_CONNECT";
    })(__ConnectionTypeValues || (__ConnectionTypeValues = {}));
    (function (ConnectionType) {
        ConnectionType.codec = () => {
            return enumeration(__ConnectionTypeValues);
        };
    })(ConnectionType = Message.ConnectionType || (Message.ConnectionType = {}));
    let Peer;
    (function (Peer) {
        Peer.codec = () => {
            return message({
                1: { name: 'id', codec: bytes, optional: true },
                2: { name: 'addrs', codec: bytes, repeats: true },
                3: { name: 'connection', codec: Message.ConnectionType.codec(), optional: true }
            });
        };
        Peer.encode = (obj) => {
            return encodeMessage(obj, Peer.codec());
        };
        Peer.decode = (buf) => {
            return decodeMessage(buf, Peer.codec());
        };
    })(Peer = Message.Peer || (Message.Peer = {}));
    Message.codec = () => {
        return message({
            1: { name: 'type', codec: Message.MessageType.codec(), optional: true },
            10: { name: 'clusterLevelRaw', codec: int32, optional: true },
            2: { name: 'key', codec: bytes, optional: true },
            3: { name: 'record', codec: bytes, optional: true },
            8: { name: 'closerPeers', codec: Message.Peer.codec(), repeats: true },
            9: { name: 'providerPeers', codec: Message.Peer.codec(), repeats: true }
        });
    };
    Message.encode = (obj) => {
        return encodeMessage(obj, Message.codec());
    };
    Message.decode = (buf) => {
        return decodeMessage(buf, Message.codec());
    };
})(Message || (Message = {}));
//# sourceMappingURL=dht.js.map