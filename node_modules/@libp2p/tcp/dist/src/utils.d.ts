import { Multiaddr } from '@multiformats/multiaddr';
export declare function multiaddrToNetConfig(addr: Multiaddr): import("@multiformats/multiaddr").MultiaddrObject;
export declare function getMultiaddrs(proto: 'ip4' | 'ip6', ip: string, port: number): Multiaddr[];
export declare function isAnyAddr(ip: string): boolean;
//# sourceMappingURL=utils.d.ts.map