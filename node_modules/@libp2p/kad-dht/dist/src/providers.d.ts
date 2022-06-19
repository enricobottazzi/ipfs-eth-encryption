import type { Startable } from '@libp2p/interfaces/startable';
import type { CID } from 'multiformats';
import type { PeerId } from '@libp2p/interfaces/peer-id';
import { Components, Initializable } from '@libp2p/interfaces/components';
export interface ProvidersInit {
    cacheSize?: number;
    /**
     * How often invalid records are cleaned. (in seconds)
     */
    cleanupInterval?: number;
    /**
     * How long is a provider valid for. (in seconds)
     */
    provideValidity?: number;
}
/**
 * This class manages known providers.
 * A provider is a peer that we know to have the content for a given CID.
 *
 * Every `cleanupInterval` providers are checked if they
 * are still valid, i.e. younger than the `provideValidity`.
 * If they are not, they are deleted.
 *
 * To ensure the list survives restarts of the daemon,
 * providers are stored in the datastore, but to ensure
 * access is fast there is an LRU cache in front of that.
 */
export declare class Providers implements Startable, Initializable {
    private components;
    private readonly cache;
    private readonly cleanupInterval;
    private readonly provideValidity;
    private readonly syncQueue;
    private started;
    private cleaner?;
    constructor(init?: ProvidersInit);
    init(components: Components): void;
    isStarted(): boolean;
    /**
     * Start the provider cleanup service
     */
    start(): Promise<void>;
    /**
     * Release any resources.
     */
    stop(): Promise<void>;
    /**
     * Check all providers if they are still valid, and if not delete them
     */
    _cleanup(): Promise<void>;
    /**
     * Get the currently known provider peer ids for a given CID
     */
    _getProvidersMap(cid: CID): Promise<Map<string, Date>>;
    /**
     * Add a new provider for the given CID
     */
    addProvider(cid: CID, provider: PeerId): Promise<void>;
    /**
     * Get a list of providers for the given CID
     */
    getProviders(cid: CID): Promise<PeerId[]>;
}
//# sourceMappingURL=providers.d.ts.map