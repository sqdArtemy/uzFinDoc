import styles from './HistoryPreview.module.scss';
import { observer } from 'mobx-react';
import { Document, Page } from 'react-pdf';
import { useState } from 'react';
import { Button, IconButton, TextareaAutosize } from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

const maxWidth = 800;

const HistoryPreview = observer(() => {
    const [numPages, setNumPages] = useState<number>();
    const [containerWidth] = useState<number>();

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
    }

    return (
        <div className={styles.bodyContainer}>
            <div className={styles.leftContainer}>
                <Document
                    file={'some.pdf'}
                    onLoadSuccess={onDocumentLoadSuccess}
                >
                    {Array.from(new Array(numPages), (_el, index) => (
                        <Page
                            key={`page_${index + 1}`}
                            pageNumber={index + 1}
                            width={
                                containerWidth
                                    ? Math.min(containerWidth, maxWidth)
                                    : maxWidth
                            }
                        />
                    ))}
                </Document>
            </div>
            <div className={styles.verticalSolidBar}></div>
            <div className={styles.rightContainer}>
                <span className={styles.rightContentContainer}>
                    <span className={styles.rightHeader}>
                        <IconButton>
                            <KeyboardArrowLeftIcon />
                        </IconButton>
                        <span className={styles.headerText}>Sample.pdf</span>
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
