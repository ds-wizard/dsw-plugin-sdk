import { z } from 'zod'

import { makeJsonCodecSimple } from '../utils/json'
import { KnowledgeModelPackageSuggestionDataSchema } from './knowledge-model-package-suggestion-data'

export const ProjectDataSchema = z.object({
    uuid: z.uuid(),
    name: z.string(),
    isTemplate: z.boolean(),
    knowledgeModelPackage: KnowledgeModelPackageSuggestionDataSchema,
})

export type ProjectData = z.infer<typeof ProjectDataSchema>

export const ProjectDataCodec = makeJsonCodecSimple(ProjectDataSchema)
