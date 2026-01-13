import { ProjectImporterEvent } from '../data/project-importer-event-data'
import { createUUID } from '../utils/uuid'

export type Path = string[]

export class ProjectImporter {
    protected events: ProjectImporterEvent[] = []

    getEvents() {
        return this.events
    }

    setReply(path: Path, value: string) {
        this.events.push({
            type: 'ReplyString',
            path: path.join('.'),
            value,
        })
    }

    setListReply(path: Path, value: string[]) {
        this.events.push({
            type: 'ReplyList',
            path: path.join('.'),
            value,
        })
    }

    setItemSelectReply(path: Path, value: string) {
        this.events.push({
            type: 'ReplyItemSelect',
            path: path.join('.'),
            value,
        })
    }

    setIntegrationReply(path: Path, value: string, raw: object) {
        this.events.push({
            type: 'ReplyIntegration',
            path: path.join('.'),
            value,
            raw,
        })
    }

    addItem(path: Path): string {
        const uuid = createUUID()
        this.events.push({
            type: 'AddItem',
            path: path.join('.'),
            uuid,
        })
        return uuid
    }
}
