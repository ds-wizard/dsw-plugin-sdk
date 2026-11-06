import { z } from 'zod'

import { makeJsonCodecSimple } from '../utils/json'
import { RoleDataSchema } from './role-data'

export const UserDataSchema = z.object({
    uuid: z.uuid(),
    email: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    // The role in the organization, which holds everywhere, and the role in
    // the workspace the user is in, if they have one there.
    tenantRole: RoleDataSchema,
    workspaceRole: RoleDataSchema.nullable(),
    imageUrl: z.string().nullable(),
    affiliation: z.string().nullable(),
})

export type UserData = z.infer<typeof UserDataSchema>

export const UserDataCodec = makeJsonCodecSimple(UserDataSchema)
