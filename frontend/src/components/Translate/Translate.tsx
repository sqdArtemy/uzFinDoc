import styles from './Translate.module.scss';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';
import { DnD } from './DnD/DnD.tsx';
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    TextField,
} from '@mui/material';
import { useErrorModal } from '../Error/Error.tsx';
import { autorun } from 'mobx';
import translateStore from '../../stores/TranslateStore.ts';
import { useLoader } from '../Loader/Loader.tsx';
import PreviewDocument from '../PreviewDocument/PreviewDocument.tsx';
import { useNavigate } from 'react-router-dom';
import userStore from '../../stores/UserStore.ts';

const Translate = observer(() => {
    const [file, setFile] = useState<File | null>(null);
    const { showErrorModal } = useErrorModal();
    const { hideLoader, showLoader } = useLoader();
    const [isPreview, setIsPreview] = useState(false);
    const [format, setFormat] = useState<string>('');
    const [previewType, setPreviewType] = useState<string>('');
    const [previewFile, setPreviewFile] = useState<
        string | ArrayBuffer | null | File
    >('');
    const [isOutputDoc, setIsOutputDoc] = useState(false);
    const [fileDetails, setFileDetails] = useState<{
        name: string;
        size?: number;
        id?: number;
    }>({ name: '', size: 0 });
    const [outputFormat, setOutputFormat] = useState<'pdf' | 'docx'>('pdf');
    const [isOrganizational, setIsOrganizational] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        translateStore.reset();
        return autorun(() => {
            if (translateStore.state === 'error') {
                showErrorModal(translateStore.errorMessage);
                hideLoader();
                setIsOutputDoc(false);
                // translateStore.currentState = 'pending';
            } else if (translateStore.state === 'loading') {
                showLoader();
                // translateStore.currentState = 'pending';
            } else if (translateStore.state === 'success') {
                hideLoader();
                navigate(
                    '/main/history/preview/' +
                        translateStore._translationData.outputDocument.id,
                    {
                        state: {
                            id: translateStore._translationData.outputDocument
                                .id,
                            name:
                                translateStore._translationData.outputDocument
                                    .name +
                                '.' +
                                translateStore._translationData.outputDocument
                                    .format,
                            type: translateStore._translationData.outputDocument
                                .format,
                            generatedAt:
                                translateStore._translationData.generatedAt,
                            inputDocument: {
                                id: translateStore._translationData
                                    .inputDocument.id,
                                name: translateStore._translationData
                                    .inputDocument.name,
                                format: translateStore._translationData
                                    .inputDocument.format,
                                uploadedAt:
                                    translateStore._translationData
                                        .inputDocument.uploadedAt,
                            },
                            creator: {
                                nameFirstName:
                                    translateStore._translationData.creator
                                        .nameFirstName,
                                nameLastName:
                                    translateStore._translationData.creator
                                        .nameLastName,
                            },
                            translationId: translateStore._translationData.id,
                        },
                    }
                );
                // translateStore.currentState = 'pending';
            }
        });
    }, []);

    const handleTranslate = () => {
        if (!file) {
            showErrorModal('Please upload a file to translate');
            return;
        }

        translateStore.translate(outputFormat, file, isOrganizational);
    };

    useEffect(() => {
        if (file && !isOutputDoc) {
            setPreviewFile(file);
            setIsPreview(true);
            setFormat('file');
            setFileDetails({
                name: file.name,
                size: file.size,
            });
            if (file.type === 'application/pdf') {
                setPreviewType('pdf');
            } else {
                setPreviewType('docx');
            }
        }
    }, [file, isOutputDoc]);

    useEffect(() => {
        return () => {
            translateStore.reset();
        };
    }, []);

    return (
        <div className={styles.bodyContainer}>
            <div className={styles.leftContainer}>
                {isPreview ? (
                    <span
                        style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <PreviewDocument
                            file={previewFile}
                            type={previewType}
                            format={format}
                            fileDetails={fileDetails}
                            isOutputDoc={isOutputDoc}
                        />
                    </span>
                ) : (
                    <span className={styles.dropzoneContainer}>
                        <DnD setFile={setFile} />
                    </span>
                )}
            </div>
            <div className={styles.solidVerticalBar}></div>
            <div className={styles.rightContainer}>
                <div className={styles.rightTranslateContainer}>
                    <span className={styles.rightTranslateHeader}>
                        <span className={styles.rightTranslateInfo}>
                            <span className={styles.textLarge}>From</span>
                            <TextField
                                disabled
                                defaultValue={'Uzbek'}
                                variant="outlined"
                                size={'small'}
                                sx={{
                                    '& .MuiInputBase-input.Mui-disabled': {
                                        WebkitTextFillColor: 'rgb(39,39,39)',
                                    },
                                }}
                            ></TextField>
                        </span>
                        <span className={styles.rightTranslateInfo}>
                            <span className={styles.textLarge}>To</span>
                            <TextField
                                disabled
                                defaultValue={'English'}
                                variant="outlined"
                                size={'small'}
                                fullWidth
                                sx={{
                                    '& .MuiInputBase-input.Mui-disabled': {
                                        WebkitTextFillColor: 'rgb(39,39,39)',
                                    },
                                }}
                            ></TextField>
                        </span>
                    </span>
                    <Button
                        size={'medium'}
                        variant="contained"
                        onClick={handleTranslate}
                        sx={{
                            width: '90%',
                        }}
                    >
                        Translate
                    </Button>
                    <span className={styles.rightTranslateOptions}>
                        <Box
                            display={'flex'}
                            justifyContent={'space-between'}
                            alignItems={'flex-end'}
                            sx={{
                                width: '100%',
                            }}
                        >
                            <FormControl>
                                <label
                                    style={{
                                        fontSize: '1.2rem',
                                    }}
                                >
                                    Output Format
                                </label>
                                <RadioGroup row name="row-radio-buttons-group">
                                    <FormControlLabel
                                        value="pdf"
                                        control={
                                            <Radio
                                                checked={outputFormat === 'pdf'}
                                                onChange={() =>
                                                    setOutputFormat('pdf')
                                                }
                                            />
                                        }
                                        label="PDF"
                                    />
                                    <FormControlLabel
                                        value="docx"
                                        control={
                                            <Radio
                                                checked={
                                                    outputFormat === 'docx'
                                                }
                                                onChange={() =>
                                                    setOutputFormat('docx')
                                                }
                                            />
                                        }
                                        label="DOCX"
                                    />
                                </RadioGroup>
                            </FormControl>
                            {userStore.storeData.organization && (
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={isOrganizational}
                                            onChange={() =>
                                                setIsOrganizational(
                                                    !isOrganizational
                                                )
                                            }
                                        />
                                    }
                                    label="Organizational"
                                />
                            )}
                        </Box>
                    </span>
                </div>
            </div>
        </div>
    );
});

export default Translate;
