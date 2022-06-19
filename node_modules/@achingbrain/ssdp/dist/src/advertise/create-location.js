import { freeport } from 'freeport-promise';
import http from 'http';
import { findAllInterfaces } from './find-all-interfaces.js';
import { detailsHandler } from './details-handler.js';
export async function createLocation(ssdp, advert) {
    if (advert.location != null) {
        return async () => await Promise.resolve();
    }
    const servers = [];
    advert.location = {};
    await Promise.all(ssdp.sockets.map(async (socket) => await Promise.all(findAllInterfaces(socket.type === 'udp4' && advert.ipv4, socket.type === 'udp6' && advert.ipv6)
        .map(async (iface) => {
        return await freeport()
            .then(async (port) => {
            return await new Promise((resolve, reject) => {
                let location = 'http://';
                if (socket.type === 'udp6') {
                    location += `[${iface.address}]`;
                }
                else {
                    location += iface.address;
                }
                location += `:${port}`;
                advert.location[socket.type] = location;
                const server = http.createServer((req, res) => {
                    detailsHandler(advert.details, req, res);
                });
                const addr = socket.address();
                server.listen(port, addr.address, () => {
                    resolve();
                });
                server.on('error', err => {
                    reject(err);
                });
                servers.push(server);
            });
        });
    }))));
    return async () => {
        await Promise.all(servers.map(async (server) => await new Promise((resolve, reject) => {
            server.close();
            resolve();
        })));
    };
}
//# sourceMappingURL=create-location.js.map