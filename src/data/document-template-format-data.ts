import { z } from 'zod'

import { makeJsonCodecSimple } from '../utils/json'

export const DocumentTemplateFormatDataSchema = z.object({
    uuid: z.uuid(),
    name: z.string(),
    icon: z.string(),
})

export type DocumentTemplateFormatData = z.infer<typeof DocumentTemplateFormatDataSchema>

export const DocumentTemplateFormatDataCodec = makeJsonCodecSimple(DocumentTemplateFormatDataSchema)
