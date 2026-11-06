import { z } from 'zod'

import { makeJsonCodecSimple } from '../utils/json'

// The knowledge model editor an integration is edited in. The workspace is the
// editor's: the knowledge model's content has none, since a package from the
// organization's library belongs to no workspace.
export const KnowledgeModelEditorDataSchema = z.object({
    uuid: z.uuid(),
    name: z.string(),
    workspaceUuid: z.uuid(),
})

export type KnowledgeModelEditorData = z.infer<typeof KnowledgeModelEditorDataSchema>

export const KnowledgeModelEditorDataCodec = makeJsonCodecSimple(KnowledgeModelEditorDataSchema)
