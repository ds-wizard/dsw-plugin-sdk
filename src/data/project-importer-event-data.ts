import { z } from 'zod'

export const JsonValueSchema: z.ZodType<unknown> = z.unknown()

export const ReplyStringEventSchema = z.object({
    type: z.literal('ReplyString'),
    path: z.string(),
    value: z.string(),
})

export const ReplyListEventSchema = z.object({
    type: z.literal('ReplyList'),
    path: z.string(),
    value: z.array(z.string()),
})

export const ReplyIntegrationEventSchema = z.object({
    type: z.literal('ReplyIntegration'),
    path: z.string(),
    value: z.string(),
    raw: JsonValueSchema,
})

export const ReplyIntegrationLegacyEventSchema = z.object({
    type: z.literal('ReplyIntegrationLegacy'),
    path: z.string(),
    value: z.string(),
    id: z.string(),
})

export const ReplyItemSelectEventSchema = z.object({
    type: z.literal('ReplyItemSelect'),
    path: z.string(),
    value: z.string(),
})

export const AddItemEventSchema = z.object({
    type: z.literal('AddItem'),
    path: z.string(),
    uuid: z.string(),
})

/** Union */
export const ProjectImporterEventSchema = z.discriminatedUnion('type', [
    ReplyStringEventSchema,
    ReplyListEventSchema,
    ReplyIntegrationEventSchema,
    ReplyItemSelectEventSchema,
    ReplyIntegrationLegacyEventSchema,
    AddItemEventSchema,
])

/** Types */
export type ReplyStringEvent = z.infer<typeof ReplyStringEventSchema>
export type ReplyListEvent = z.infer<typeof ReplyListEventSchema>
export type ReplyIntegrationEvent = z.infer<typeof ReplyIntegrationEventSchema>
export type ReplyIntegrationLegacyEvent = z.infer<typeof ReplyIntegrationLegacyEventSchema>
export type ReplyItemSelectEvent = z.infer<typeof ReplyItemSelectEventSchema>
export type AddItemEvent = z.infer<typeof AddItemEventSchema>

export type ProjectImporterEvent = z.infer<typeof ProjectImporterEventSchema>
