import { setMaxListeners } from 'events';
import take from 'it-take';
import length from 'it-length';
import { QUERY_SELF_INTERVAL, QUERY_SELF_TIMEOUT, K } from './constants.js';
import { TimeoutController } from 'timeout-abort-controller';
import { anySignal } from 'any-signal';
import { logger } from '@libp2p/logger';
import { pipe } from 'it-pipe';
import { Components } from '@libp2p/interfaces/components';
/**
 * Receives notifications of new peers joining the network that support the DHT protocol
 */
export class QuerySelf {
    constructor(init) {
        this.components = new Components();
        const { peerRouting, lan, count, interval, queryTimeout } = init;
        this.log = logger(`libp2p:kad-dht:${lan ? 'lan' : 'wan'}:query-self`);
        this.running = false;
        this.peerRouting = peerRouting;
        this.count = count ?? K;
        this.interval = interval ?? QUERY_SELF_INTERVAL;
        this.queryTimeout = queryTimeout ?? QUERY_SELF_TIMEOUT;
    }
    init(components) {
        this.components = components;
    }
    isStarted() {
        return this.running;
    }
    async start() {
        if (this.running) {
            return;
        }
        this.running = true;
        this._querySelf();
    }
    async stop() {
        this.running = false;
        if (this.timeoutId != null) {
            clearTimeout(this.timeoutId);
        }
        if (this.controller != null) {
            this.controller.abort();
        }
    }
    _querySelf() {
        Promise.resolve().then(async () => {
            const timeoutController = new TimeoutController(this.queryTimeout);
            try {
                this.controller = new AbortController();
                const signal = anySignal([this.controller.signal, timeoutController.signal]);
                // this controller will get used for lots of dial attempts so make sure we don't cause warnings to be logged
                try {
                    if (setMaxListeners != null) {
                        setMaxListeners(Infinity, signal);
                    }
                }
                catch { } // fails on node < 15.4
                const found = await pipe(this.peerRouting.getClosestPeers(this.components.getPeerId().toBytes(), {
                    signal
                }), (source) => take(source, this.count), async (source) => await length(source));
                this.log('query ran successfully - found %d peers', found);
            }
            catch (err) {
                this.log('query error', err);
            }
            finally {
                this.timeoutId = setTimeout(this._querySelf.bind(this), this.interval);
                timeoutController.clear();
            }
        }).catch(err => {
            this.log('query error', err);
        });
    }
}
//# sourceMappingURL=query-self.js.map