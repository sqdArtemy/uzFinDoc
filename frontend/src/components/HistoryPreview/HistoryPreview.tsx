import styles from './HistoryPreview.module.scss';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    IconButton,
    Rating,
    TextareaAutosize,
} from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import PreviewDocument from '../PreviewDocument/PreviewDocument.tsx';
import { useLocation } from 'react-router-dom';
import { autorun } from 'mobx';
import translateStore from '../../stores/TranslateStore.ts';
import { useLoader } from '../Loader/Loader.tsx';
import { useErrorModal } from '../Error/Error.tsx';
import pdfIcon from '../../assets/pdf-icon.svg';
import docIcon from '../../assets/doc-icon.svg';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import feedbackStore from '../../stores/FeedbackStore.ts';
import translationsStore from '../../stores/TranslationsStore.ts';
import moment from 'moment';
import translationStore from '../../stores/TranslationStore.ts';

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
        translationId: number;
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
    const [rating, setRating] = useState<0 | 1 | 2 | 3 | 4 | 5 | null>(0);
    const [feedbackText, setFeedbackText] = useState<string>('');

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
                translationsStore.currentState = 'pending';
            } else if (translateStore.state === 'loading') {
                showLoader();
                translationsStore.currentState = 'pending';
            } else if (translateStore.state === 'success') {
                hideLoader();
                setPreviewFile(translateStore._documentData);
                translationsStore.currentState = 'pending';
            }
        });
    }, []);

    useEffect(() => {
        return autorun(() => {
            if (feedbackStore.state === 'error') {
                showErrorModal(feedbackStore.errorMsg);
                hideLoader();
                feedbackStore.currentState = 'pending';
            } else if (feedbackStore.state === 'loading') {
                showLoader();
                feedbackStore.currentState = 'pending';
            } else if (feedbackStore.state === 'success') {
                hideLoader();
                feedbackStore.currentState = 'pending';
            }
        });
    }, []);

    useEffect(() => {
        translationStore.getTranslationById(locationState.translationId);
        return autorun(() => {
            if (translationStore.state === 'error') {
                showErrorModal(translationStore.errorMessage);
                hideLoader();
                translationStore.currentState = 'pending';
            } else if (translationStore.state === 'loading') {
                showLoader();
                translationStore.currentState = 'pending';
            } else if (translationStore.state === 'success') {
                hideLoader();
                setRating(translationStore.data.feedback?.rating || 0);
                setFeedbackText(translationStore.data.feedback?.review || '');
                translationStore.currentState = 'pending';
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

    function handleSendFeedback() {
        feedbackStore.createFeedback(
            rating ? rating : 0,
            feedbackText,
            locationState.translationId
        );
        window.location.reload();
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
                            isOutputDoc={true}
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
                        <IconButton onClick={() => window.history.back()}>
                            <KeyboardArrowLeftIcon />
                        </IconButton>
                        <span className={styles.headerText}>
                            {locationState.name}
                        </span>
                    </span>
                    <span
                        className={[styles.descriptionText].join(' ')}
                        style={{
                            paddingLeft: '2.5rem',
                        }}
                    >
                        Translated at:{' '}
                        {moment(locationState.generatedAt).format(
                            'MMMM Do YYYY, h:mm:ss a'
                        )}
                    </span>
                    <span
                        key={locationState.inputDocument.id}
                        className={styles.memberContainer}
                        style={{
                            marginLeft: '2.1rem',
                        }}
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
                                        {moment(
                                            locationState.inputDocument
                                                .uploadedAt
                                        ).format('DD/MM/YYYY HH:mm')}
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
                    <TextareaAutosize
                        minRows={10}
                        maxRows={10}
                        placeholder="Enter your feedback here"
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        disabled={!!translationStore.data.feedback}
                        style={{
                            marginLeft: '2.5rem',
                            fontSize: '1.2rem',
                        }}
                    />
                    <Box
                        display={'flex'}
                        flexDirection={'row'}
                        gap={'3rem'}
                        width={'100%'}
                        justifyContent={'flex-end'}
                        alignItems={'center'}
                        marginLeft={'2.5rem'}
                    >
                        <Rating
                            name="simple-controlled"
                            value={rating}
                            onChange={(_event, newValue) => {
                                setRating(newValue as 0 | 1 | 2 | 3 | 4 | 5);
                            }}
                            readOnly={!!translationStore.data.feedback}
                            size={'large'}
                            style={{
                                fontSize: '2.4rem',
                            }}
                        />
                        {!translationStore.data.feedback && (
                            <Button
                                variant="contained"
                                onClick={handleSendFeedback}
                                size={'large'}
                                style={{
                                    fontSize: '1.2rem',
                                    width: '15rem',
                                }}
                            >
                                Send Feedback
                            </Button>
                        )}
                    </Box>
                </span>
            </div>
        </div>
    );
});

export default HistoryPreview;
