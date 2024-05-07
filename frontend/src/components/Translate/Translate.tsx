import styles from './Translate.module.scss';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { DnD } from './DnD/DnD.tsx';
import { Button, TextField } from '@mui/material';

const Translate = observer(() => {
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        console.log(file);
    }, [file]);

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
                    <Button size={'medium'} variant="contained">
                        Start Translating
                    </Button>
                </div>
            </div>
        </div>
    );
});

export default Translate;
