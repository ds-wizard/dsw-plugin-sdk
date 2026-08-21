import { z } from 'zod'

import { makeJsonCodecSimple } from '../utils/json'

export const RoleDataSchema = z.object({
    uuid: z.uuid(),
    name: z.string(),
    permissions: z.array(z.string()),
})

export type RoleData = z.infer<typeof RoleDataSchema>

export const RoleDataCodec = makeJsonCodecSimple(RoleDataSchema)
