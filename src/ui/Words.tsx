import { createContext, ReactNode, useContext } from 'react'

/**
 * Everything the UI components say of their own accord — a close button, a
 * loading message, the name of a remove button. English by default; a plugin
 * that translates provides its own once with `UiWordsProvider`, and a
 * component's own prop overrides it where one place needs another word.
 */
export type UiWords = {
    close: string
    cancel: string
    loading: string
    /** After the name of a link that opens in a new tab. */
    newTab: string
    /** The name of the button that removes `name`, a tag for instance. */
    remove: (name: string) => string
    /** A progress bar's value as it is read out. */
    progressValue: (value: number, max: number) => string
    /** The button that shows a secret field's value. */
    show: (label: string) => string
    /** The heading of a form's error summary. */
    errorSummaryTitle: string
    /** Said when a file chosen for an import cannot be read or made sense of. */
    importFileError: string
    /** A file upload's button and the hint beside it. */
    fileUploadButton: string
    fileUploadHint: string
    /** The chosen file, and how many more were dropped with it. */
    fileChosen: (name: string, others: number) => string
    /** A table's sort, announced when it changes. */
    tableSorted: (column: string, ascending: boolean) => string
    /** A copy button's tooltip, and what it says once it has copied. */
    copyPrompt: string
    copied: string
    /** A date field's button that empties it. */
    clearDate: (label: string) => string
    /** A stored value that is not a date; `{value}` is replaced by it. */
    invalidDate: string
    /** The Markdown editor's toolbar; `toolbar` names it after the field. */
    markdown: MarkdownWords
}

export type MarkdownWords = {
    heading2: string
    heading3: string
    bold: string
    italic: string
    strike: string
    link: string
    image: string
    bulletList: string
    orderedList: string
    code: string
    codeBlock: string
    quote: string
    linkPrompt: string
    imagePrompt: string
    apply: string
    cancel: string
    modes: string
    rich: string
    markdown: string
    toolbar: (label: string) => string
}

export const englishUiWords: UiWords = {
    close: 'Close',
    cancel: 'Cancel',
    loading: 'Loading…',
    newTab: '(opens in a new tab)',
    remove: (name) => `Remove ${name}`,
    progressValue: (value, max) => `${value} of ${max}`,
    show: (label) => `Show ${label}`,
    errorSummaryTitle: 'This form could not be saved',
    importFileError: 'The file could not be read or imported. Make sure you chose the right file.',
    fileUploadButton: 'Choose a file',
    fileUploadHint: 'or drop it here',
    fileChosen: (name, others) => (others > 0 ? `${name} (+${others})` : name),
    tableSorted: (column, ascending) =>
        `Sorted by ${column}, ${ascending ? 'ascending' : 'descending'}`,
    copyPrompt: 'Click to copy',
    copied: 'Copied',
    clearDate: (label) => `Clear ${label}`,
    invalidDate: 'The stored value "{value}" is not a valid date.',
    markdown: {
        heading2: 'Heading 2',
        heading3: 'Heading 3',
        bold: 'Bold',
        italic: 'Italic',
        strike: 'Strikethrough',
        link: 'Link',
        image: 'Image',
        bulletList: 'Bullet list',
        orderedList: 'Numbered list',
        code: 'Inline code',
        codeBlock: 'Code block',
        quote: 'Quote',
        linkPrompt: 'Link address',
        imagePrompt: 'Image address',
        apply: 'Apply',
        cancel: 'Cancel',
        modes: 'Editing mode',
        rich: 'Formatted',
        markdown: 'Markdown',
        toolbar: (label) => `${label} formatting`,
    },
}

const UiWordsContext = createContext<UiWords>(englishUiWords)

export type UiWordsProviderProps = {
    /** The words to use, merged over the English ones. */
    words: Partial<UiWords>
    children: ReactNode
}

export function UiWordsProvider({ words, children }: UiWordsProviderProps) {
    const parent = useContext(UiWordsContext)
    return (
        <UiWordsContext.Provider value={{ ...parent, ...words }}>
            {children}
        </UiWordsContext.Provider>
    )
}

export function useUiWords(): UiWords {
    return useContext(UiWordsContext)
}
