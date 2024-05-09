import styles from './HistoryPreview.module.scss';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { Box, Button, IconButton, TextareaAutosize } from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import PreviewDocument from '../PreviewDocument/PreviewDocument.tsx';
import { useLocation } from 'react-router-dom';
import { autorun } from 'mobx';
import translateStore from '../../stores/TranslateStore.ts';
import { useLoader } from '../Loader/Loader.tsx';
import { useErrorModal } from '../Error/Error.tsx';

const HistoryPreview = observer(() => {
    const location = useLocation();
    const { showErrorModal } = useErrorModal();
    const { hideLoader, showLoader } = useLoader();
    const [locationState] = useState<{
        id: number;
        name: string;
        type: string;
        format: string;
    }>(location.state);
    const [previewFile, setPreviewFile] = useState<string | ArrayBuffer | null>(
        ''
    );
    const [fileDetails, setFileDetails] = useState<{
        name: string;
        id: number;
    }>({
        name: '',
        id: -1,
    });

    useEffect(() => {
        setFileDetails({
            name: locationState.name,
            id: locationState.id,
        });
        translateStore.previewDocument(locationState.id);
        return autorun(() => {
            if (translateStore.state === 'error') {
                showErrorModal(translateStore.errorMessage);
                hideLoader();
            } else if (translateStore.state === 'loading') {
                showLoader();
            } else if (translateStore.state === 'success') {
                hideLoader();
                setPreviewFile(translateStore._documentData);
            }
        });
    }, []);

    return (
        <div className={styles.bodyContainer}>
            <div className={styles.leftContainer}>
                {previewFile ? (
                    <Box display={'flex'} height={'100%'} width={'100%'}>
                        <PreviewDocument
                            file={previewFile}
                            type={locationState.type}
                            format={'base64'}
                            fileDetails={fileDetails}
                            isOutputDoc={false}
                        />
                    </Box>
                ) : (
                    <></>
                )}
            </div>
            <div className={styles.verticalSolidBar}></div>
            <div className={styles.rightContainer}>
                <span className={styles.rightContentContainer}>
                    <span className={styles.rightHeader}>
                        <IconButton>
                            <KeyboardArrowLeftIcon />
                        </IconButton>
                        <span className={styles.headerText}>
                            {locationState.name}
                        </span>
                    </span>
                    <span className={[styles.descriptionText].join(' ')}>
                        Translated at: 05/01 1:15:43
                    </span>
                </span>
                <span className={styles.rightInputContainer}>
                    <TextareaAutosize minRows={10} maxRows={10} />
                    <Button variant="contained">Send Feedback</Button>
                </span>
            </div>
        </div>
    );
});

export default HistoryPreview;
