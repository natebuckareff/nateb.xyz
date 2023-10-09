import { ModelAdapter, PageEventModel, createModelAdapter } from './adapter';

export function createMemoryAdapter(): ModelAdapter {
    const map = new Map<number, PageEventModel>();
    const index = new Map<string, PageEventModel>();

    return createModelAdapter({
        async insert(arg) {
            const id = map.size;
            const record: PageEventModel = { id, updated: arg.created, ...arg };
            map.set(map.size, record);
            const { pid } = arg;
            if (pid) index.set(pid, record);
        },

        async update(pid, updated, change) {
            const record = index.get(pid);
            if (record === undefined) return;
            if (updated) record.updated = updated;
            if (change.absent) {
                record.totalAbsence = record.totalAbsence + change.absent;
            }
            if (change.scroll) {
                record.maxScroll = Math.max(record.maxScroll, change.scroll);
            }
        },

        generateUuuid() {
            return crypto.randomUUID();
        },
    });
}
