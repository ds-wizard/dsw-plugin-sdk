import { z } from 'zod'

import { makeJsonCodecSimple } from '../utils/json'
import { RoleDataSchema } from './role-data'

export const UserDataSchema = z.object({
    uuid: z.uuid(),
    email: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    role: RoleDataSchema,
    imageUrl: z.string().nullable(),
    affiliation: z.string().nullable(),
})

export type UserData = z.infer<typeof UserDataSchema>

export const UserDataCodec = makeJsonCodecSimple(UserDataSchema)
