import { z } from 'zod'

import { makeJsonCodecSimple } from '../utils/json'

export const KnowledgeModelPackageSuggestionDataSchema = z.object({
    uuid: z.uuid(),
    name: z.string(),
    description: z.string(),
    organizationId: z.string(),
    kmId: z.string(),
    version: z.string(),
})

export type KnowledgeModelPackageSuggestionData = z.infer<
    typeof KnowledgeModelPackageSuggestionDataSchema
>

export const KnowledgeModelPackageSuggestionDataCodec = makeJsonCodecSimple(
    KnowledgeModelPackageSuggestionDataSchema,
)
