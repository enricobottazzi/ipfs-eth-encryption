import { MESSAGE_TYPE_LOOKUP } from '../message/index.js';
export function sendingQueryEvent(fields) {
    return {
        ...fields,
        name: 'SENDING_QUERY',
        type: 0,
        messageName: fields.type,
        messageType: MESSAGE_TYPE_LOOKUP.indexOf(fields.type.toString())
    };
}
export function peerResponseEvent(fields) {
    return {
        ...fields,
        name: 'PEER_RESPONSE',
        type: 1,
        messageName: fields.messageType,
        closer: (fields.closer != null) ? fields.closer : [],
        providers: (fields.providers != null) ? fields.providers : []
    };
}
export function finalPeerEvent(fields) {
    return {
        ...fields,
        name: 'FINAL_PEER',
        type: 2
    };
}
export function queryErrorEvent(fields) {
    return {
        ...fields,
        name: 'QUERY_ERROR',
        type: 3
    };
}
export function providerEvent(fields) {
    return {
        ...fields,
        name: 'PROVIDER',
        type: 4
    };
}
export function valueEvent(fields) {
    return {
        ...fields,
        name: 'VALUE',
        type: 5
    };
}
export function addingPeerEvent(fields) {
    return {
        ...fields,
        name: 'ADDING_PEER',
        type: 6
    };
}
export function dialingPeerEvent(fields) {
    return {
        ...fields,
        name: 'DIALING_PEER',
        type: 7
    };
}
//# sourceMappingURL=events.js.map