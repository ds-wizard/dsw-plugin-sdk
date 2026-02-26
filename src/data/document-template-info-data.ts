import { z } from 'zod'

import { makeJsonCodecSimple } from '../utils/json'

export const DocumentTemplateInfoDataSchema = z.object({
    uuid: z.uuid(),
    name: z.string(),
    organizationId: z.string(),
    templateId: z.string(),
    version: z.string(),
})

export type DocumentTemplateInfoData = z.infer<typeof DocumentTemplateInfoDataSchema>

export const DocumentTemplateInfoDataCodec = makeJsonCodecSimple(DocumentTemplateInfoDataSchema)
