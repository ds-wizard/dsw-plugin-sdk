import { z } from 'zod'

import { makeJsonCodecSimple } from '../utils/json'
import { KnowledgeModelPackageSuggestionDataSchema } from './knowledge-model-package-suggestion-data'

export const ProjectDataSchema = z.object({
    uuid: z.uuid(),
    name: z.string(),
    isTemplate: z.boolean(),
    knowledgeModelPackage: KnowledgeModelPackageSuggestionDataSchema,
    // The workspace the project is in, to scope what the plugin asks the API
    // for (`w`). `null` only where there is no real project: the preview of a
    // knowledge model from the organization's library.
    workspaceUuid: z.uuid().nullable(),
})

export type ProjectData = z.infer<typeof ProjectDataSchema>

export const ProjectDataCodec = makeJsonCodecSimple(ProjectDataSchema)
