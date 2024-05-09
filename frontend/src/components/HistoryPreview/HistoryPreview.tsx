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
import pdfIcon from '../../assets/pdf-icon.png';
import docIcon from '../../assets/doc-icon.png';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';

const HistoryPreview = observer(() => {
    const location = useLocation();
    const { showErrorModal } = useErrorModal();
    const { hideLoader, showLoader } = useLoader();
    const [locationState] = useState<{
        id: number;
        name: string;
        type: string;
        format: string;
        generatedAt: string;
        inputDocument: {
            id: number;
            name: string;
            format: string;
            uploadedAt: string;
        };
        creator: {
            nameFirstName: string;
            nameLastName: string;
        };
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

    function handleDownload(id: number, name: string, format: string) {
        translateStore.downloadDocument(id, `${name.split('.')[0]}.${format}`);
    }

    function handleDelete(id: number) {
        //translateStore.deleteDocument(id);
        console.log('Delete', id);
    }

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
                        Translated at: {locationState.generatedAt}
                    </span>
                    <span
                        key={locationState.inputDocument.id}
                        className={styles.memberContainer}
                    >
                        <span className={styles.memberLeftContainer}>
                            <img
                                src={
                                    locationState.inputDocument.format === 'pdf'
                                        ? pdfIcon
                                        : docIcon
                                }
                            />
                            <span className={styles.memberTextContainer}>
                                <span
                                    className={[
                                        styles.memberNameContainer,
                                        styles.headerText,
                                    ].join(' ')}
                                >
                                    {locationState.inputDocument.name.split(
                                        '.'
                                    )[0] +
                                        `.${locationState.inputDocument.format}`}
                                </span>
                                <span className={styles.descriptionContainer}>
                                    <span className={styles.descriptionText}>
                                        {locationState.inputDocument.uploadedAt}
                                    </span>
                                    <span className={styles.descriptionText}>
                                        Editor:{' '}
                                        {locationState.creator
                                            ? `${locationState.creator.nameFirstName} ${locationState.creator.nameLastName}`
                                            : 'undefined'}
                                    </span>
                                </span>
                            </span>
                        </span>
                        <span className={styles.actionButtonsContainer}>
                            <IconButton
                                onClick={() =>
                                    handleDownload(
                                        locationState.inputDocument.id,
                                        locationState.inputDocument.name,
                                        locationState.inputDocument.format
                                    )
                                }
                            >
                                <DownloadIcon />
                            </IconButton>
                            <IconButton
                                onClick={() =>
                                    handleDelete(locationState.inputDocument.id)
                                }
                            >
                                <DeleteIcon />
                            </IconButton>
                        </span>
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
