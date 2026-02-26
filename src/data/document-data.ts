import { z } from 'zod'

import { makeJsonCodecSimple } from '../utils/json'
import { DocumentStateDataSchema } from './document-state-data'
import { DocumentTemplateFormatDataSchema } from './document-template-format-data'
import { DocumentTemplateInfoDataSchema } from './document-template-info-data'
import { ProjectInfoDataSchema } from './project-info-data'

export const DocumentDataSchema = z.object({
    uuid: z.uuid(),
    name: z.string(),
    createdAt: z.iso.datetime(),
    project: ProjectInfoDataSchema,
    projectEventUuid: z.uuid().nullable(),
    projectVersion: z.string().nullable(),
    documentTemplate: DocumentTemplateInfoDataSchema,
    format: DocumentTemplateFormatDataSchema,
    state: DocumentStateDataSchema,
    createdBy: z.uuid().nullable(),
    fileSize: z.int().nullable(),
    workerLog: z.string().nullable(),
})

export type DocumentData = z.infer<typeof DocumentDataSchema>

export const DocumentDataCodec = makeJsonCodecSimple(DocumentDataSchema)
