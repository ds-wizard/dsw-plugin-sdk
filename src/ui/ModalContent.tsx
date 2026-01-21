import { ReactNode } from 'react'

export type ModalContentProps = {
    modalTitle: ReactNode
    modalBody: ReactNode
    modalAction: ModalContentAction

    onActionClose: () => void
}

export type ModalContentAction = {
    label: ReactNode
    onClick?: () => void
}

export function ModalContent({
    modalTitle,
    modalBody,
    modalAction,
    onActionClose,
}: ModalContentProps) {
    return (
        <>
            <div className="modal-header">
                <h5 className="modal-title">{modalTitle}</h5>
            </div>
            <div className="modal-body">{modalBody}</div>
            <div className="modal-footer">
                <button className="btn btn-primary" onClick={modalAction.onClick}>
                    {modalAction.label}
                </button>
                <button className="btn btn-secondary" onClick={() => onActionClose()}>
                    Close
                </button>
            </div>
        </>
    )
}
