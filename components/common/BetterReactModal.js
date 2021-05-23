import Modal from "react-responsive-modal";

export default function BetterReactModal({ isOpen, children, onClose, preventClose }) {
    const handleClose = () => {
        if (!preventClose)
            onClose()
    }

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            showCloseIcon={false}
            closeOnOverlayClick={!preventClose}
            closeOnEsc={!preventClose}
            classNames={{
                modal: 'bg-transparent p-0 my-10 shadow-none'
            }}
            center
        >
            {children}
        </Modal>
    )
}