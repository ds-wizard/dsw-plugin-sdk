import { z } from 'zod'

import { makeJsonCodecSimple } from '../utils/json'

export const AnnotationDataSchema = z.object({
    key: z.string(),
    value: z.string(),
})

export type AnnotationData = z.infer<typeof AnnotationDataSchema>

export const AnnotationDataCodec = makeJsonCodecSimple(AnnotationDataSchema)
