import styles from './Translate.module.scss';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { DnD } from './DnD/DnD.tsx';
import { Button, TextField } from '@mui/material';
import { useErrorModal } from '../Error/Error.tsx';
import { autorun } from 'mobx';
import translateStore from '../../stores/TranslateStore.ts';
import { useLoader } from '../Loader/Loader.tsx';
import { Document, Page } from 'react-pdf';

const Translate = observer(() => {
    const [file, setFile] = useState<File | null>(null);
    const { showErrorModal } = useErrorModal();
    const { hideLoader, showLoader } = useLoader();
    const [isPreview, setIsPreview] = useState(false);

    const [numPages, setNumPages] = useState<number>();
    const [containerWidth] = useState<number>();

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        setNumPages(numPages);
    }

    useEffect(() => {
        autorun(() => {
            if (translateStore.state === 'error') {
                showErrorModal(translateStore.errorMessage);
            } else if (translateStore.state === 'loading') {
                showLoader();
            } else if (translateStore.state === 'success') {
                hideLoader();
                console.log(translateStore.data);
                setIsPreview(true);
            }
        });
    }, []);

    const handleTranslate = () => {
        console.log('Translate');
        if (!file) {
            showErrorModal('Please upload a file to translate');
            return;
        }

        console.log('HANDLE Translate', file);
        translateStore.translate('pdf', file);
    };

    return (
        <div className={styles.bodyContainer}>
            <div className={styles.leftContainer}>
                {isPreview ? (
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
                                        ? Math.min(containerWidth, 800)
                                        : 800
                                }
                            />
                        ))}
                    </Document>
                ) : (
                    <DnD setFile={setFile} />
                )}
            </div>
            <div className={styles.solidVerticalBar}></div>
            <div className={styles.rightContainer}>
                <div className={styles.rightTranslateContainer}>
                    <span className={styles.rightTranslateHeader}>
                        <span className={styles.rightTranslateInfo}>
                            <span className={styles.textLarge}>
                                Source Language
                            </span>
                            <TextField
                                disabled
                                defaultValue={'Uzbek'}
                                variant="outlined"
                                size={'small'}
                            ></TextField>
                        </span>
                        <span className={styles.rightTranslateInfo}>
                            <span className={styles.textLarge}>
                                Target Language
                            </span>
                            <TextField
                                disabled
                                defaultValue={'English'}
                                variant="outlined"
                                size={'small'}
                            ></TextField>
                        </span>
                    </span>
                    <Button
                        size={'medium'}
                        variant="contained"
                        onClick={handleTranslate}
                    >
                        Start Translating
                    </Button>
                </div>
            </div>
        </div>
    );
});

export default Translate;
