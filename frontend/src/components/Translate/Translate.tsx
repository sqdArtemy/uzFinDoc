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
                <div>
                    <span>
                        <span>
                            <span>Source Language</span>
                            <TextField
                                disabled
                                defaultValue={'Uzbek'}
                                variant="outlined"
                                size={'small'}
                            ></TextField>
                        </span>
                        <span>
                            <span>Target Language</span>
                            <TextField
                                disabled
                                defaultValue={'English'}
                                variant="outlined"
                                size={'small'}
                            ></TextField>
                        </span>
                    </span>
                    <Button variant="contained">Start Translating</Button>
                </div>
            </div>
        </div>
    );
});

export default Translate;
