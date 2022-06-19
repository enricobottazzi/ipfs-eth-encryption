import errcode from 'err-code';
import { pipe } from 'it-pipe';
import * as lp from 'it-length-prefixed';
import drain from 'it-drain';
import first from 'it-first';
import { Message } from './message/index.js';
import { EventEmitter, CustomEvent } from '@libp2p/interfaces/events';
import { dialingPeerEvent, sendingQueryEvent, peerResponseEvent, queryErrorEvent } from './query/events.js';
import { logger } from '@libp2p/logger';
import { Components } from '@libp2p/interfaces/components';
import { abortableDuplex } from 'abortable-iterator';
/**
 * Handle network operations for the dht
 */
export class Network extends EventEmitter {
    /**
     * Create a new network
     */
    constructor(init) {
        super();
        this.components = new Components();
        const { protocol, lan } = init;
        this.log = logger(`libp2p:kad-dht:${lan ? 'lan' : 'wan'}:network`);
        this.running = false;
        this.protocol = protocol;
    }
    init(components) {
        this.components = components;
    }
    /**
     * Start the network
     */
    async start() {
        if (this.running) {
            return;
        }
        this.running = true;
    }
    /**
     * Stop all network activity
     */
    async stop() {
        this.running = false;
    }
    /**
     * Is the network online?
     */
    isStarted() {
        return this.running;
    }
    /**
     * Send a request and record RTT for latency measurements
     */
    async *sendRequest(to, msg, options = {}) {
        if (!this.running) {
            return;
        }
        this.log('sending %s to %p', msg.type, to);
        yield dialingPeerEvent({ peer: to });
        yield sendingQueryEvent({ to, type: msg.type });
        let stream;
        try {
            const connection = await this.components.getConnectionManager().openConnection(to, options);
            const streamData = await connection.newStream(this.protocol, options);
            stream = streamData.stream;
            const response = await this._writeReadMessage(stream, msg.serialize(), options);
            yield peerResponseEvent({
                from: to,
                messageType: response.type,
                closer: response.closerPeers,
                providers: response.providerPeers,
                record: response.record
            });
        }
        catch (err) {
            yield queryErrorEvent({ from: to, error: err });
        }
        finally {
            if (stream != null) {
                stream.close();
            }
        }
    }
    /**
     * Sends a message without expecting an answer
     */
    async *sendMessage(to, msg, options = {}) {
        if (!this.running) {
            return;
        }
        this.log('sending %s to %p', msg.type, to);
        yield dialingPeerEvent({ peer: to });
        yield sendingQueryEvent({ to, type: msg.type });
        let stream;
        try {
            const connection = await this.components.getConnectionManager().openConnection(to, options);
            const data = await connection.newStream(this.protocol, options);
            stream = data.stream;
            await this._writeMessage(stream, msg.serialize(), options);
            yield peerResponseEvent({ from: to, messageType: msg.type });
        }
        catch (err) {
            yield queryErrorEvent({ from: to, error: err });
        }
        finally {
            if (stream != null) {
                stream.close();
            }
        }
    }
    /**
     * Write a message to the given stream
     */
    async _writeMessage(stream, msg, options) {
        if (options.signal != null) {
            stream = abortableDuplex(stream, options.signal);
        }
        await pipe([msg], lp.encode(), stream, drain);
    }
    /**
     * Write a message and read its response.
     * If no response is received after the specified timeout
     * this will error out.
     */
    async _writeReadMessage(stream, msg, options) {
        if (options.signal != null) {
            stream = abortableDuplex(stream, options.signal);
        }
        const res = await pipe([msg], lp.encode(), stream, lp.decode(), async (source) => {
            const buf = await first(source);
            if (buf != null) {
                return buf;
            }
            throw errcode(new Error('No message received'), 'ERR_NO_MESSAGE_RECEIVED');
        });
        const message = Message.deserialize(res);
        // tell any listeners about new peers we've seen
        message.closerPeers.forEach(peerData => {
            this.dispatchEvent(new CustomEvent('peer', {
                detail: peerData
            }));
        });
        message.providerPeers.forEach(peerData => {
            this.dispatchEvent(new CustomEvent('peer', {
                detail: peerData
            }));
        });
        return message;
    }
}
//# sourceMappingURL=network.js.map