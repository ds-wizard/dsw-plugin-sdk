import { ChangeEvent, ReactNode, useId, useState } from 'react'

import { KnowledgeModelData } from '../data'
import type { ProjectImporterComponentProps } from '../elements'
import { ProjectImporter } from '../project-importer'

type ReadAs = 'text' | 'arrayBuffer' | 'dataURL'

export type SimpleImporterProps<TParsed = unknown> = ProjectImporterComponentProps<
    unknown,
    unknown
> & {
    heading: ReactNode
    label: ReactNode
    description?: ReactNode

    /** File input accept attribute */
    accept?: string

    /** How to read the file */
    readAs?: ReadAs

    /**
     * Convert FileReader result into parsed data.
     * Defaults to JSON.parse for text input.
     */
    parse?: (raw: string | ArrayBuffer) => TParsed

    /** Map parsed data into ProjectImporter */
    importData: (
        importer: ProjectImporter,
        parsed: TParsed,
        knowledgeModel: KnowledgeModelData | null,
    ) => void

    /** Error handling */
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

export function SimpleImporter<TParsed = unknown>({
    onImport,
    knowledgeModel,

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
}: SimpleImporterProps<TParsed>) {
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
