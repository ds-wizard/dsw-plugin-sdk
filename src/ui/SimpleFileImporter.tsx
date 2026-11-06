import { ReactNode, useState } from 'react'

import { KnowledgeModelData, ProjectImporterEvent } from '../data'
import { ProjectImporter } from '../project-importer'
import { FileUpload } from './FileUpload'
import { RootProps, rootProps } from './internal/root'
import { Body, Title } from './Text'
import { useUiWords } from './Words'

export type ReadAs = 'text' | 'arrayBuffer' | 'dataURL'

export type SimpleFileImporterProps<TParsed = unknown> = RootProps & {
    /** The importer's `onImport`: what the file became, for the wizard to continue with. */
    onImport: (events: ProjectImporterEvent[]) => void
    /** The importer's `knowledgeModel`, handed to `importData`. */
    knowledgeModel?: KnowledgeModelData | null

    /** The importer's title, an `h2`. */
    heading: ReactNode
    /** The file field's label. */
    label: string
    /** A sentence under the heading: what file it takes, where to get it. */
    description?: ReactNode

    /** What can be chosen, as the input's `accept`; `.json,application/json` unless told otherwise. */
    accept?: string
    /** How the file is read; as text unless told otherwise. */
    readAs?: ReadAs

    /** The file's content into what `importData` works with; `JSON.parse` unless told otherwise. */
    parse?: (raw: string | ArrayBuffer) => TParsed
    /** Sets the replies the parsed file says, through the importer. */
    importData: (
        importer: ProjectImporter,
        parsed: TParsed,
        knowledgeModel: KnowledgeModelData | null,
    ) => void

    /** Said under the field when the file cannot be read, parsed or imported. */
    errorMessage?: string
    /** The error in words, in place of `errorMessage`: what was wrong with the file. */
    formatError?: (error: unknown) => string
}

function defaultJsonParse(raw: string | ArrayBuffer): unknown {
    if (typeof raw !== 'string') throw new Error('Expected text content')
    return JSON.parse(raw)
}

function readFile(file: File, readAs: ReadAs): Promise<string | ArrayBuffer> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onerror = () => reject(reader.error ?? new Error('Failed to read the file'))
        reader.onload = () => {
            const result = reader.result
            if (typeof result === 'string' || result instanceof ArrayBuffer) resolve(result)
            else reject(new Error('Unsupported file content'))
        }
        if (readAs === 'text') reader.readAsText(file)
        else if (readAs === 'arrayBuffer') reader.readAsArrayBuffer(file)
        else reader.readAsDataURL(file)
    })
}

/**
 * A whole project importer for a file: a heading, a sentence about the file,
 * and a field to choose or drop it. The chosen file is read, parsed and
 * turned into replies by `importData`, and the events go to the wizard; a file
 * that cannot be is said under the field, and another can be chosen. The
 * plugin writes only the parsing and the mapping:
 *
 *     <SimpleFileImporter
 *         heading="Import from a DMP"
 *         label="DMP file"
 *         knowledgeModel={knowledgeModel}
 *         onImport={onImport}
 *         importData={(importer, dmp) => importer.setReply(titlePath, dmp.title)}
 *     />
 */
export function SimpleFileImporter<TParsed = unknown>({
    onImport,
    knowledgeModel = null,
    heading,
    label,
    description,
    accept = '.json,application/json',
    readAs = 'text',
    parse = defaultJsonParse as (raw: string | ArrayBuffer) => TParsed,
    importData,
    errorMessage,
    formatError,
    ...props
}: SimpleFileImporterProps<TParsed>) {
    const words = useUiWords()
    const [file, setFile] = useState<File | null>(null)
    const [error, setError] = useState<string | undefined>(undefined)

    const onChange = async (chosen: File) => {
        setFile(chosen)
        setError(undefined)
        try {
            const parsed = parse(await readFile(chosen, readAs))
            const importer = new ProjectImporter()
            importData(importer, parsed, knowledgeModel)
            onImport(importer.getEvents())
        } catch (err) {
            setFile(null)
            setError(formatError ? formatError(err) : (errorMessage ?? words.importFileError))
        }
    }

    return (
        <div {...rootProps(props, 'ui-stack')}>
            <Title>{heading}</Title>
            {description !== undefined && <Body>{description}</Body>}
            <FileUpload
                label={label}
                file={file}
                onChange={onChange}
                onClear={() => {
                    setFile(null)
                    setError(undefined)
                }}
                accept={accept}
                error={error}
            />
        </div>
    )
}
