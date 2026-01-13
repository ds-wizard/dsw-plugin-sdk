import { z } from 'zod'

import { makeJsonCodecSimple } from '../utils'
import { AnnotationDataSchema } from './annotation-data'

export const EntityDataSchema = z
    .object({
        uuid: z.string(),
        annotations: z.array(AnnotationDataSchema).optional(),
    })
    .loose()

export const EntityMapDataSchema = z.record(z.string(), EntityDataSchema)

export const KnowledgeModelDataSchema = z
    .object({
        entities: z.object({
            answers: EntityMapDataSchema,
            chapters: EntityMapDataSchema,
            choices: EntityMapDataSchema,
            experts: EntityMapDataSchema,
            integrations: EntityMapDataSchema,
            metrics: EntityMapDataSchema,
            phases: EntityMapDataSchema,
            questions: EntityMapDataSchema,
            references: EntityMapDataSchema,
            resourceCollections: EntityMapDataSchema,
            resourcePages: EntityMapDataSchema,
            tags: EntityMapDataSchema,
        }),
        structure: z.object({
            questions: EntityMapDataSchema,
        }),
    })
    .loose()

export type EntityData = z.infer<typeof EntityDataSchema>
export type EntityMapData = z.infer<typeof EntityMapDataSchema>
export type KnowledgeModelData = z.infer<typeof KnowledgeModelDataSchema>

export const KnowledgeModelDataCodec = makeJsonCodecSimple(KnowledgeModelDataSchema)
