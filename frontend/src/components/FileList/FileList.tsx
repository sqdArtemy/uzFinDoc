import styles from './FileList.module.scss';
import { observer } from 'mobx-react';
import { IconButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import docIcon from '../../assets/doc-icon.png';
import pdfIcon from '../../assets/pdf-icon.png';

const FileList = observer(() => {
    return (
        <>
            <span className={styles.bottomContainerHeaderText}>
                Translation History
            </span>
            <div className={styles.membersListContainer}>
                <span className={styles.memberContainer}>
                    <span className={styles.memberLeftContainer}>
                        <img src={pdfIcon ? pdfIcon : docIcon} />
                        <span className={styles.memberTextContainer}>
                            <span
                                className={[
                                    styles.memberNameContainer,
                                    styles.headerText,
                                ].join(' ')}
                            >
                                Sample.pdf
                            </span>
                            <span className={styles.descriptionContainer}>
                                <span className={styles.descriptionText}>
                                    05/01 1:15:43
                                </span>
                                <span className={styles.descriptionText}>
                                    Editor: User Name
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
            </div>
        </>
    );
});

export default FileList;
