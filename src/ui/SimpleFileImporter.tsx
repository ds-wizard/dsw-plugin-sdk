import { ChangeEvent, ReactNode, useId, useState } from 'react'

import { KnowledgeModelData, ProjectImporterEvent } from '../data'
import { ProjectImporter } from '../project-importer'

type ReadAs = 'text' | 'arrayBuffer' | 'dataURL'

export type SimpleFileImporterProps<TParsed = unknown> = {
    // SDK opinionated output
    onImport: (events: ProjectImporterEvent[]) => void

    // Optional context
    knowledgeModel?: KnowledgeModelData | null

    // UI
    heading: ReactNode
    label: ReactNode
    description?: ReactNode

    // File handling
    accept?: string // default application/json
    readAs?: ReadAs // default text

    // Parsing + import mapping
    parse?: (raw: string | ArrayBuffer) => TParsed // default JSON.parse(text)
    importData: (
        importer: ProjectImporter,
        parsed: TParsed,
        knowledgeModel: KnowledgeModelData | null,
    ) => void

    // Errors
    errorMessage?: ReactNode
    formatError?: (err: unknown) => ReactNode

    inputId?: string
}

function defaultJsonParse(raw: string | ArrayBuffer): unknown {
    if (typeof raw !== 'string') {
        throw new Error('Expected text content')
    }
    return JSON.parse(raw)
}

function readFile(file: File, readAs: ReadAs): Promise<string | ArrayBuffer> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onerror = () => reject(reader.error ?? new Error('Failed to read file'))

        reader.onload = () => {
            const result = reader.result
            if (typeof result === 'string' || result instanceof ArrayBuffer) {
                resolve(result)
            } else {
                reject(new Error('Unsupported file content'))
            }
        }

        if (readAs === 'text') reader.readAsText(file)
        else if (readAs === 'arrayBuffer') reader.readAsArrayBuffer(file)
        else reader.readAsDataURL(file)
    })
}

export function SimpleFileImporter<TParsed = unknown>({
    onImport,
    knowledgeModel = null,

    heading,
    label,
    description,

    accept = 'application/json',
    readAs = 'text',

    parse = defaultJsonParse as (raw: string | ArrayBuffer) => TParsed,
    importData,

    errorMessage = 'Error reading or parsing file. Make sure you selected a valid document.',
    formatError,
    inputId,
}: SimpleFileImporterProps<TParsed>) {
    const autoId = useId()
    const id = inputId ?? `simple-importer-${autoId}`
    const [error, setError] = useState<ReactNode | null>(null)

    const onFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file) return

        try {
            const raw = await readFile(file, readAs)
            const parsed = parse(raw)

            const importer = new ProjectImporter()
            importData(importer, parsed, knowledgeModel)

            setError(null)
            onImport(importer.getEvents())
        } catch (err) {
            setError(formatError ? formatError(err) : errorMessage)
        } finally {
            // Allow selecting the same file again
            event.target.value = ''
        }
    }

    return (
        <div className="col col-detail mx-auto">
            <div className="mb-3">
                <h2>{heading}</h2>
            </div>

            <div className="mb-3">
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor={id} className="form-label">
                        {label}
                    </label>

                    <input
                        type="file"
                        id={id}
                        accept={accept}
                        className={`form-control${error ? ' is-invalid' : ''}`}
                        onChange={onFileChange}
                    />

                    {description && <div className="mt-2 text-muted">{description}</div>}
                </div>
            </div>
        </div>
    )
}
