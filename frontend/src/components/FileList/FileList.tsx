import styles from './FileList.module.scss';
import { observer } from 'mobx-react';
import { Badge, BadgeProps, Box, IconButton, styled } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import docIcon from '../../assets/doc-icon.svg';
import pdfIcon from '../../assets/pdf-icon.svg';
import { useEffect, useState } from 'react';
import { autorun } from 'mobx';
import translationsStore from '../../stores/TranslationsStore.ts';
import { useErrorModal } from '../Error/Error.tsx';
import { useLoader } from '../Loader/Loader.tsx';
import { ITranslationResponse } from '../../api/interfaces/responses/translation.ts';
import { useNavigate } from 'react-router-dom';
import translateStore from '../../stores/TranslateStore.ts';
import userStore from '../../stores/UserStore.ts';
import moment from 'moment';
import translationStore from '../../stores/TranslationStore.ts';
import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;

const StyledBadge = styled(Badge)<BadgeProps>(() => ({
    '& .MuiBadge-badge': {
        right: -8,
        top: '50%',
    },
}));

const FileList = observer(({ organizationId }) => {
    const { showErrorModal } = useErrorModal();
    const { hideLoader, showLoader } = useLoader();
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        if (organizationId)
            translationsStore.getOrganizationTranslations(organizationId);
        else translationsStore.getTranslations();

        console.log(translationsStore.storeData);
    }, [organizationId]);

    useEffect(() => {
        return autorun(() => {
            if (translateStore.state === 'error') {
                showErrorModal(translateStore.errorMessage);
                hideLoader();
                translateStore.currentState = 'pending';
            } else if (translateStore.state === 'loading') {
                showLoader();
                translateStore.currentState = 'pending';
            } else if (translateStore.state === 'success') {
                hideLoader();
                translateStore.currentState = 'pending';
            }
        });
    }, []);

    useEffect(() => {
        return autorun(() => {
            if (translationsStore.state === 'error') {
                showErrorModal(translationsStore.errorMessage);
                hideLoader();
                translationsStore.currentState = 'pending';
            } else if (translationsStore.state === 'loading') {
                showLoader();
                translationsStore.currentState = 'pending';
            } else if (translationsStore.state === 'success') {
                hideLoader();
                translationsStore.currentState = 'pending';
            }
        });
    }, []);

    useEffect(() => {
        return autorun(() => {
            if (translationStore.state === 'error') {
                showErrorModal(translationStore.errorMessage);
                hideLoader();
            } else if (translationStore.state === 'loading') {
                showLoader();
            } else if (translationStore.state === 'success') {
                hideLoader();
            }
        });
    }, []);

    function navigateToPreview(translation: ITranslationResponse) {
        translateStore.previewDocument(translation.outputDocument.id);
        translationStore.getTranslationById(translation.id);
        console.log(translation);
        const inputDocument = {
            id: translation.inputDocument.id,
            name: translation.inputDocument.name,
            format: translation.inputDocument.format,
            uploadedAt: translation.inputDocument.uploadedAt,
        };
        console.log(inputDocument);
        const locationState = {
            id: translation.outputDocument.id,
            name:
                translation.outputDocument.name +
                '.' +
                translation.outputDocument.format,
            type: translation.outputDocument.format,
            format: 'base64',
            generatedAt: translation.generatedAt,
            inputDocument: {
                id: inputDocument.id,
                name: inputDocument.name,
                format: inputDocument.format,
                uploadedAt: inputDocument.uploadedAt,
            },
            translationId: translation.id,
            creator: {
                nameFirstName: organizationId
                    ? translation.creator.nameFirstName
                    : userStore.data.nameFirstName,
                nameLastName: organizationId
                    ? translation.creator.nameLastName
                    : userStore.data.nameLastName,
            },
        };
        console.log(locationState);
        navigate(`/main/history/preview/${translation.outputDocument.id}`, {
            state: locationState,
        });
    }

    function handleDownload(documentId: number, name: string, format: string) {
        translateStore.downloadDocument(documentId, `${name}.${format}`);
    }

    function handleDelete(translationId: number) {
        // translateStore.deleteTranslation(translationId);
        console.log('Delete', translationId);
    }

    return (
        <>
            <Box
                display={'flex'}
                alignItems={'center'}
                justifyContent={'space-between'}
                sx={{
                    paddingRight: '2rem',
                }}
            >
                <StyledBadge
                    badgeContent={translationsStore.data.length}
                    color={'primary'}
                >
                    <span className={styles.bottomContainerHeaderText}>
                        Translation History
                    </span>
                </StyledBadge>
                <RangePicker
                    onChange={(_date, dateString) => {
                        setStartDate(dateString[0]);
                        setEndDate(dateString[1]);
                        console.log('Start Date:', startDate);
                        console.log('End Date:', endDate);
                    }}
                    style={{
                        fontSize: '1.2rem',
                    }}
                />
            </Box>
            <div className={styles.membersListContainer}>
                {translationsStore.data.map((translation) => {
                    return (
                        <span
                            key={translation.id}
                            className={styles.memberContainer}
                        >
                            <span
                                className={styles.memberLeftContainer}
                                onClick={() => navigateToPreview(translation)}
                            >
                                <img
                                    src={
                                        translation.outputDocument.format ===
                                        'pdf'
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
                                        {translation.outputDocument.name}
                                        {'.'}
                                        {translation.outputDocument.format}
                                    </span>
                                    <span
                                        className={styles.descriptionContainer}
                                    >
                                        <span
                                            className={styles.descriptionText}
                                        >
                                            {moment(
                                                translation.generatedAt
                                            ).format('DD/MM/YYYY HH:mm')}
                                        </span>
                                        {organizationId ? (
                                            <span
                                                className={
                                                    styles.descriptionText
                                                }
                                            >
                                                Editor:{' '}
                                                {translation.creator
                                                    ? `${translation.creator.nameFirstName} ${translation.creator.nameLastName}`
                                                    : 'undefined'}
                                            </span>
                                        ) : (
                                            <></>
                                        )}
                                    </span>
                                </span>
                            </span>
                            <span className={styles.actionButtonsContainer}>
                                <IconButton
                                    onClick={() =>
                                        handleDownload(
                                            translation.outputDocument.id,
                                            translation.outputDocument.name,
                                            translation.outputDocument.format
                                        )
                                    }
                                >
                                    <DownloadIcon />
                                </IconButton>
                                <IconButton
                                    onClick={() => handleDelete(translation.id)}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </span>
                        </span>
                    );
                })}
            </div>
        </>
    );
});

export default FileList;
