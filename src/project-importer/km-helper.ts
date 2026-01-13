import { EntityMapData, KnowledgeModelData } from '../data/knowledge-model-data'

export class KMHelper {
    protected knowledgeModel: KnowledgeModelData

    constructor(knowledgeModel: KnowledgeModelData) {
        this.knowledgeModel = knowledgeModel
    }

    getAnswerUuidByAnnotation(key: string, value: string) {
        return this.getEntityUuidByAnnotation(this.knowledgeModel.entities.answers, key, value)
    }

    getChapterUuidByAnnotation(key: string, value: string) {
        return this.getEntityUuidByAnnotation(this.knowledgeModel.entities.chapters, key, value)
    }

    getChoiceUuidByAnnotation(key: string, value: string) {
        return this.getEntityUuidByAnnotation(this.knowledgeModel.entities.choices, key, value)
    }

    getExpertUuidByAnnotation(key: string, value: string) {
        return this.getEntityUuidByAnnotation(this.knowledgeModel.entities.experts, key, value)
    }

    getIntegrationUuidByAnnotation(key: string, value: string) {
        return this.getEntityUuidByAnnotation(this.knowledgeModel.entities.integrations, key, value)
    }

    getMetricUuidByAnnotation(key: string, value: string) {
        return this.getEntityUuidByAnnotation(this.knowledgeModel.entities.metrics, key, value)
    }

    getPhaseUuidByAnnotation(key: string, value: string) {
        return this.getEntityUuidByAnnotation(this.knowledgeModel.entities.phases, key, value)
    }

    getQuestionUuidByAnnotation(key: string, value: string) {
        return this.getEntityUuidByAnnotation(this.knowledgeModel.entities.questions, key, value)
    }

    getReferenceUuidByAnnotation(key: string, value: string) {
        return this.getEntityUuidByAnnotation(this.knowledgeModel.entities.references, key, value)
    }

    getResourceCollectionUuidByAnnotation(key: string, value: string) {
        return this.getEntityUuidByAnnotation(
            this.knowledgeModel.entities.resourceCollections,
            key,
            value,
        )
    }

    getResourcePageUuidByAnnotation(key: string, value: string) {
        return this.getEntityUuidByAnnotation(
            this.knowledgeModel.entities.resourcePages,
            key,
            value,
        )
    }

    getTagUuidByAnnotation(key: string, value: string) {
        return this.getEntityUuidByAnnotation(this.knowledgeModel.entities.tags, key, value)
    }

    protected getEntityUuidByAnnotation(
        entities: EntityMapData,
        key: string,
        value: string,
    ): string | null {
        for (const [uuid, entity] of Object.entries(entities)) {
            if (
                entity.annotations &&
                entity.annotations.some(
                    (annotation) => annotation.key === key && annotation.value === value,
                )
            ) {
                return uuid
            }
        }

        return null
    }
}
