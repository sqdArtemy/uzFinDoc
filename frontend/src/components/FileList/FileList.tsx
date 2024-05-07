import styles from './FileList.module.scss';
import { observer } from 'mobx-react';
import { IconButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import docIcon from '../../assets/doc-icon.png';
import pdfIcon from '../../assets/pdf-icon.png';
import { useEffect } from 'react';
import { autorun } from 'mobx';
import translationsStore from '../../stores/TranslationsStore.ts';
import { useErrorModal } from '../Error/Error.tsx';
import { useLoader } from '../Loader/Loader.tsx';

const FileList = observer(({ organizationId }) => {
    const { showErrorModal } = useErrorModal();
    const { hideLoader, showLoader } = useLoader();

    useEffect(() => {
        if (organizationId)
            translationsStore.getOrganizationTranslations(organizationId);
        else translationsStore.getTranslations();
        return autorun(() => {
            if (translationsStore.state === 'error') {
                showErrorModal(translationsStore.errorMessage);
                hideLoader();
            } else if (translationsStore.state === 'loading') {
                showLoader();
            } else if (translationsStore.state === 'success') {
                hideLoader();
            }
        });
    }, []);

    return (
        <>
            <span className={styles.bottomContainerHeaderText}>
                Translation History
            </span>
            <div className={styles.membersListContainer}>
                {translationsStore.data.map((translation) => {
                    return (
                        <span
                            key={translation.id}
                            className={styles.memberContainer}
                        >
                            <span className={styles.memberLeftContainer}>
                                <img src={pdfIcon ? pdfIcon : docIcon} />
                                <span className={styles.memberTextContainer}>
                                    <span
                                        className={[
                                            styles.memberNameContainer,
                                            styles.headerText,
                                        ].join(' ')}
                                    >
                                        {translation.outputDocument.name}
                                    </span>
                                    <span
                                        className={styles.descriptionContainer}
                                    >
                                        <span
                                            className={styles.descriptionText}
                                        >
                                            {translation.generatedAt.toString()}
                                        </span>
                                        <span
                                            className={styles.descriptionText}
                                        >
                                            Editor:{' '}
                                            {translation.creator.nameFirstName +
                                                ' ' +
                                                translation.creator
                                                    .nameLastName}
                                        </span>
                                    </span>
                                </span>
                            </span>
                            <span className={styles.actionButtonsContainer}>
                                <IconButton>
                                    <DownloadIcon />
                                </IconButton>
                                <IconButton>
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
