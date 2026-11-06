import { ReactNode } from 'react'

import { RootProps, rootProps } from './internal/root'

export type ProseProps = RootProps &
    (
        | { children: ReactNode; html?: never }
        /** HTML the plugin has rendered, Markdown for instance; it is inserted as it is, so sanitize it. */
        | { html: string; children?: never }
    )

/** The typographic scope for content the plugin did not write: a README, an answer, rendered Markdown. */
export function Prose({ children, html, ...props }: ProseProps) {
    if (html !== undefined) {
        return <div {...rootProps(props, 'ui-prose')} dangerouslySetInnerHTML={{ __html: html }} />
    }
    return <div {...rootProps(props, 'ui-prose')}>{children}</div>
}
