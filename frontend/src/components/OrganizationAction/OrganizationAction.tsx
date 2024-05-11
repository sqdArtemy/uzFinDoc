import React, { useEffect } from 'react';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Box } from '@mui/material';
import { autorun } from 'mobx';
import userStore from '../../stores/UserStore.ts';
import { useErrorModal } from '../Error/Error.tsx';
import { useLoader } from '../Loader/Loader.tsx';
import { observer } from 'mobx-react';

const OrganizationModal = observer(({ open, handleClose, initialData }) => {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const { showErrorModal } = useErrorModal();
    const { hideLoader, showLoader } = useLoader();

    const handleCreateOrUpdate = () => {
        if (!initialData) {
            userStore.createOrganization({
                name,
                email,
            });
        } else {
            userStore.updateOrganization({
                name,
                email,
            });
        }
    };

    useEffect(
        () =>
            autorun(() => {
                if (userStore.state === 'error') {
                    showErrorModal(userStore.errorMsg);
                    hideLoader();
                    userStore.currentState = 'pending';
                } else if (userStore.state === 'loading') {
                    showLoader();
                    userStore.currentState = 'pending';
                } else if (userStore.state === 'success') {
                    //handleClose();
                    hideLoader();
                    userStore.currentState = 'pending';
                }
            }),
        []
    );

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setEmail(initialData.email);
        }
    }, [open]);

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="organization-modal-title"
            aria-describedby="organization-modal-description"
        >
            <Box
                sx={{
                    position: 'absolute',
                    width: 400,
                    top: `50%`,
                    left: `50%`,
                    transform: `translate(-50%, -50%)`,
                    bgcolor: 'background.paper',
                    padding: '2rem',
                }}
            >
                <span
                    id="organization-modal-title"
                    style={{
                        fontSize: '1.7rem',
                        fontWeight: 500,
                    }}
                >
                    {!initialData
                        ? 'Create Organization'
                        : 'Update Organization'}
                </span>
                <form>
                    <TextField
                        label="Organization Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Organization Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCreateOrUpdate}
                    >
                        {!initialData ? 'Create' : 'Update'}
                    </Button>
                </form>
            </Box>
        </Modal>
    );
});

export default OrganizationModal;
