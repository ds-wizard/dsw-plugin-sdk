import { z } from 'zod'

import { makeJsonCodecSimple } from '../utils/json'

export const ProjectInfoDataSchema = z.object({
    uuid: z.uuid(),
    name: z.string(),
})

export type ProjectInfoData = z.infer<typeof ProjectInfoDataSchema>

export const ProjectInfoDataCodec = makeJsonCodecSimple(ProjectInfoDataSchema)
