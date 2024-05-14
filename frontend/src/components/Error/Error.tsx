import { createContext, useContext, useState } from 'react';
import { Modal, Typography } from '@mui/material';

const ErrorModalContext = createContext<{
    isOpen: boolean;
    errorMessage: string;
    showErrorModal: (errorText: string) => void;
    hideErrorModal: () => void;
}>({
    isOpen: false,
    errorMessage: '',
    showErrorModal: () => {},
    hideErrorModal: () => {},
});

export const useErrorModal = () => useContext(ErrorModalContext);

export function ErrorModalProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const showErrorModal = (errorText: string) => {
        setErrorMessage(errorText);
        setIsOpen(true);
    };

    const hideErrorModal = () => setIsOpen(false);

    return (
        <ErrorModalContext.Provider
            value={{ isOpen, errorMessage, showErrorModal, hideErrorModal }}
        >
            <ErrorModal />
            {children}
        </ErrorModalContext.Provider>
    );
}

function ErrorModal() {
    const { isOpen, errorMessage, hideErrorModal } = useErrorModal();

    return (
        <Modal open={isOpen} onClose={hideErrorModal}>
            <Typography
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 3,
                    border: 'none',
                    '&:focus': {
                        outline: 'none',
                    },
                    borderRadius: 3,
                    color: 'white',
                    backgroundColor: 'rgba(250,12,12,0.9)',
                }}
            >
                {errorMessage}
            </Typography>
        </Modal>
    );
}
