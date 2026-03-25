import { z } from 'zod'

import { makeJsonCodecSimple } from '../utils'
import { JsonValueSchema } from './json-value-schema'

export const PlainTypeSchema = z.object({
    type: z.literal('PlainType'),
    value: z.string(),
})

export const IntegrationTypeSchema = z.object({
    type: z.literal('IntegrationType'),
    value: z.string(),
    raw: JsonValueSchema,
})

export const IntegrationReplySchema = z.object({
    type: z.literal('IntegrationReply'),
    value: z.discriminatedUnion('type', [PlainTypeSchema, IntegrationTypeSchema]),
})

export type PlainType = z.infer<typeof PlainTypeSchema>
export type IntegrationType = z.infer<typeof IntegrationTypeSchema>
export type IntegrationReply = z.infer<typeof IntegrationReplySchema>

export const IntegrationReplyCodec = makeJsonCodecSimple(IntegrationReplySchema)

export function createIntegrationReply(value: string, raw: unknown): IntegrationReply {
    return {
        type: 'IntegrationReply',
        value: {
            type: 'IntegrationType',
            value,
            raw,
        },
    }
}
