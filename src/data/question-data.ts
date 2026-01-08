import { z } from 'zod'

import { makeJsonCodecSimple } from '../utils/json'

export const QuestionValueTypeSchema = z.enum([
    'StringQuestionValueType',
    'NumberQuestionValueType',
    'DateQuestionValueType',
    'DateTimeQuestionValueType',
    'TimeQuestionValueType',
    'TextQuestionValueType',
    'EmailQuestionValueType',
    'UrlQuestionValueType',
    'ColorQuestionValueType',
])

// Field schemas

export const CommonQuestionFieldsSchema = z.object({
    uuid: z.uuid(),
    title: z.string(),
    text: z.string().nullable(),
    requiredPhaseUuid: z.uuid().nullable(),
    tagUuids: z.array(z.uuid()),
    referenceUuids: z.array(z.uuid()),
    expertUuids: z.array(z.uuid()),
    //   annotations: z.array(AnnotationSchema),
})

export const OptionsQuestionFieldsSchema = z.object({
    answerUuids: z.array(z.uuid()),
})

export const ListQuestionFieldsSchema = z.object({
    itemTemplateQuestionUuids: z.array(z.uuid()),
})

export const ValueQuestionFieldsSchema = z.object({
    valueType: QuestionValueTypeSchema,
})

export const MultiChoiceQuestionFieldsSchema = z.object({
    choiceUuids: z.array(z.uuid()),
})

export const ItemSelectQuestionFieldsSchema = z.object({
    listQuestionUuid: z.uuid().nullable(),
})

export const IntegrationQuestionFieldsSchema = z.object({
    integrationUuid: z.uuid(),
    variables: z.record(z.string(), z.string()), // Dict String String
})

export const FileQuestionFieldsSchema = z.object({
    maxSize: z.number().int().nullable(),
    fileTypes: z.string().nullable(),
})

// Question type schemas

export const OptionsQuestionSchema = CommonQuestionFieldsSchema.extend({
    questionType: z.literal('OptionsQuestion'),
}).extend(OptionsQuestionFieldsSchema.shape)

export const ListQuestionSchema = CommonQuestionFieldsSchema.extend({
    questionType: z.literal('ListQuestion'),
}).extend(ListQuestionFieldsSchema.shape)

export const ValueQuestionSchema = CommonQuestionFieldsSchema.extend({
    questionType: z.literal('ValueQuestion'),
}).extend(ValueQuestionFieldsSchema.shape)

export const MultiChoiceQuestionSchema = CommonQuestionFieldsSchema.extend({
    questionType: z.literal('MultiChoiceQuestion'),
}).extend(MultiChoiceQuestionFieldsSchema.shape)

export const ItemSelectQuestionSchema = CommonQuestionFieldsSchema.extend({
    questionType: z.literal('ItemSelectQuestion'),
}).extend(ItemSelectQuestionFieldsSchema.shape)

export const IntegrationQuestionSchema = CommonQuestionFieldsSchema.extend({
    questionType: z.literal('IntegrationQuestion'),
}).extend(IntegrationQuestionFieldsSchema.shape)

export const FileQuestionSchema = CommonQuestionFieldsSchema.extend({
    questionType: z.literal('FileQuestion'),
}).extend(FileQuestionFieldsSchema.shape)

// Full QuestionData schema

export const QuestionDataSchema = z.discriminatedUnion('questionType', [
    OptionsQuestionSchema,
    ListQuestionSchema,
    ValueQuestionSchema,
    MultiChoiceQuestionSchema,
    ItemSelectQuestionSchema,
    IntegrationQuestionSchema,
    FileQuestionSchema,
])

export type QuestionValueType = z.infer<typeof QuestionValueTypeSchema>

export type QuestionData = z.infer<typeof QuestionDataSchema>

export type OptionsQuestionData = z.infer<typeof OptionsQuestionSchema>
export type ListQuestion = z.infer<typeof ListQuestionSchema>
export type ValueQuestion = z.infer<typeof ValueQuestionSchema>
export type MultiChoiceQuestion = z.infer<typeof MultiChoiceQuestionSchema>
export type ItemSelectQuestion = z.infer<typeof ItemSelectQuestionSchema>
export type IntegrationQuestion = z.infer<typeof IntegrationQuestionSchema>
export type FileQuestionData = z.infer<typeof FileQuestionSchema>

export const QuestionDataCodec = makeJsonCodecSimple(QuestionDataSchema)
