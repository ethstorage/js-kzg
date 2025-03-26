export type DataHexString = string;
export type BytesLike = DataHexString | Uint8Array;

export function assertArgument(
    check: boolean,
    message: string,
    name: string,
    value: unknown
): asserts check {
    if (!check) {
        const error = new Error(message) as Error & { code?: string; argument?: string; value?: unknown };
        error.code = "INVALID_ARGUMENT";
        error.argument = name;
        error.value = value;
        throw error;
    }
}

export function getBytes(value: BytesLike, name?: string): Uint8Array {
    return _getBytes(value, name, false);
}

function _getBytes(value: BytesLike, name?: string, copy?: boolean): Uint8Array {
    if (value instanceof Uint8Array) {
        if (copy) { return new Uint8Array(value); }
        return value;
    }

    if (typeof(value) === "string" && value.match(/^0x(?:[0-9a-f][0-9a-f])*$/i)) {
        const result = new Uint8Array((value.length - 2) / 2);
        let offset = 2;
        for (let i = 0; i < result.length; i++) {
            result[i] = parseInt(value.substring(offset, offset + 2), 16);
            offset += 2;
        }
        return result;
    }

    assertArgument(false, "invalid BytesLike value", name || "value", value);
}

const HexCharacters: string = "0123456789abcdef";

export function hexlify(data: BytesLike): string {
    const bytes = getBytes(data);

    let result = "0x";
    for (let i = 0; i < bytes.length; i++) {
        const v = bytes[i];
        result += HexCharacters[(v & 0xf0) >> 4] + HexCharacters[v & 0x0f];
    }
    return result;
}
