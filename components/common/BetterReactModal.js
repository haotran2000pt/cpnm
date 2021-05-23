import Modal from "react-responsive-modal";

export default function BetterReactModal({ isOpen, children, onClose }) {
    const handleRequestClose = () => {
        onClose()
    }

    return (
        <Modal
            open={isOpen}
            onClose={handleRequestClose}
            showCloseIcon={false}
            classNames={{
                modal: 'bg-transparent p-0 my-10 shadow-none'
            }}
            center
        >
            {children}
        </Modal>
    )
}