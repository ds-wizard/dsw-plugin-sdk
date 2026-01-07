import { z } from 'zod'

import { makeJsonCodecSimple } from '../utils/json'

export const ProjectDataSchema = z.object({
    uuid: z.uuid(),
    name: z.string(),
    isTemplate: z.boolean(),
    knowledgeModelPackageId: z.string(),
})

export type ProjectData = z.infer<typeof ProjectDataSchema>

export const ProjectDataCodec = makeJsonCodecSimple(ProjectDataSchema)
