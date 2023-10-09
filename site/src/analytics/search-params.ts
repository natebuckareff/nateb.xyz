export type QueryParamValue = string | number | boolean | null;

export function encodeQueryParams(values: Record<string, QueryParamValue>): string {
    const params = new URLSearchParams();
    for (const k in values) {
        const v = values[k];
        if (typeof v === 'boolean') {
            params.append(k, v ? '1' : '0');
        } else if (typeof v === 'number') {
            params.append(k, v + '');
        } else if (v != null) {
            params.append(k, v);
        }
    }
    return params.size > 0 ? '?' + params.toString() : '';
}
