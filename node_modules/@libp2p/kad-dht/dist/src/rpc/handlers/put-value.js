import { bufferToRecordKey } from '../../utils.js';
import errcode from 'err-code';
import { verifyRecord } from '@libp2p/record/validators';
import { logger } from '@libp2p/logger';
import { Components } from '@libp2p/interfaces/components';
export class PutValueHandler {
    constructor(init) {
        this.components = new Components();
        const { validators } = init;
        this.log = logger('libp2p:kad-dht:rpc:handlers:put-value');
        this.validators = validators;
    }
    init(components) {
        this.components = components;
    }
    async handle(peerId, msg) {
        const key = msg.key;
        this.log('%p asked us to store value for key %b', peerId, key);
        const record = msg.record;
        if (record == null) {
            const errMsg = `Empty record from: ${peerId.toString()}`;
            this.log.error(errMsg);
            throw errcode(new Error(errMsg), 'ERR_EMPTY_RECORD');
        }
        try {
            await verifyRecord(this.validators, record);
            record.timeReceived = new Date();
            const recordKey = bufferToRecordKey(record.key);
            await this.components.getDatastore().put(recordKey, record.serialize());
            this.log('put record for %b into datastore under key %k', key, recordKey);
        }
        catch (err) {
            this.log('did not put record for key %b into datastore %o', key, err);
        }
        return msg;
    }
}
//# sourceMappingURL=put-value.js.map