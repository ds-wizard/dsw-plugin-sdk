import { z } from 'zod'

export type DecodeResult<T> = { ok: true; value: T } | { ok: false; error: string }

export type JsonCodec<T> = {
    init: () => T
    decode: (raw: string) => DecodeResult<T>
    encode: (data: T) => string
}

export type JsonCodecSimple<T> = {
    decode: (raw: string) => DecodeResult<T>
    encode: (data: T) => string
}

export function makeJsonCodec<T extends z.ZodTypeAny>(
    schema: T,
    defaultData: z.infer<T>,
): JsonCodec<z.infer<T>> {
    return {
        init(): z.infer<T> {
            return defaultData
        },

        decode(raw: string): DecodeResult<z.infer<T>> {
            try {
                const parsed: unknown = JSON.parse(raw)
                const res = schema.safeParse(parsed)
                return res.success
                    ? { ok: true, value: res.data }
                    : { ok: false, error: res.error.message }
            } catch (e) {
                return { ok: false, error: e instanceof Error ? e.message : 'Invalid JSON' }
            }
        },

        encode(data: z.infer<T>): string {
            const normalized = schema.parse(data)
            return JSON.stringify(normalized)
        },
    }
}

export function makeNullCodec(): JsonCodec<null> {
    return {
        init(): null {
            return null
        },

        decode(_raw: string): DecodeResult<null> {
            return { ok: true, value: null }
        },

        encode(_data: null): string {
            return ''
        },
    }
}

export function makeJsonCodecSimple<T extends z.ZodTypeAny>(
    schema: T,
): JsonCodecSimple<z.infer<T>> {
    return {
        decode(raw: string): DecodeResult<z.infer<T>> {
            try {
                const parsed: unknown = JSON.parse(raw)
                const res = schema.safeParse(parsed)
                return res.success
                    ? { ok: true, value: res.data }
                    : { ok: false, error: res.error.message }
            } catch (e) {
                return { ok: false, error: e instanceof Error ? e.message : 'Invalid JSON' }
            }
        },

        encode(data: z.infer<T>): string {
            const normalized = schema.parse(data)
            return JSON.stringify(normalized)
        },
    }
}
