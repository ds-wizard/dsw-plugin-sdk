import { z } from 'zod'

import { makeJsonCodecSimple } from '../utils/json'

export const DocumentStateDataSchema = z.enum([
    'QueuedDocumentState',
    'InProgressDocumentState',
    'DoneDocumentState',
    'ErrorDocumentState',
])

export type DocumentStateData = z.infer<typeof DocumentStateDataSchema>

export const DocumentStateDataCodec = makeJsonCodecSimple(DocumentStateDataSchema)
