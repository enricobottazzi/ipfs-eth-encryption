import type { Advertisment, SSDP } from '../index.js';
import { CachedAdvert } from '../adverts.js';
export interface Advert {
    usn: string;
    interval: number;
    ttl: number;
    ipv4: boolean;
    ipv6: boolean;
    location: Record<string, string>;
    details: () => Promise<any>;
}
export declare function advertise(ssdp: SSDP, options: Advertisment): Promise<CachedAdvert>;
//# sourceMappingURL=index.d.ts.map