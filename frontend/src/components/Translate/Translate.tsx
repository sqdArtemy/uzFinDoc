import styles from './Translate.module.scss';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { DnD } from './DnD/DnD.tsx';
import { Button, TextField } from '@mui/material';
import { useErrorModal } from '../Error/Error.tsx';

const Translate = observer(() => {
    const [file, setFile] = useState<File | null>(null);
    const { showErrorModal } = useErrorModal();

    useEffect(() => {
        console.log(file);
    }, [file]);

    const handleTranslate = () => {
        console.log('Translate');
        if (!file) {
            showErrorModal('Please upload a file to translate');
            return;
        }
    };

    return (
        <div className={styles.bodyContainer}>
            <div className={styles.leftContainer}>
                <DnD setFile={setFile} />
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
