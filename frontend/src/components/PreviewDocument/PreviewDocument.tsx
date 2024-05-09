import { observer } from 'mobx-react';
import { Document, Page } from 'react-pdf';
import { useEffect, useState } from 'react';
import wordIcon from '../../assets/word-icon.png';
import { Box, IconButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { autorun } from 'mobx';
import translateStore from '../../stores/TranslateStore.ts';
import { useErrorModal } from '../Error/Error.tsx';
import { useLoader } from '../Loader/Loader.tsx';

const maxWidth = 800;

const PreviewDocument = observer(
    ({
        file,
        type,
        format,
        fileDetails,
        isOutputDoc,
    }: {
        file: string | ArrayBuffer | File | null;
        type: string;
        format: string;
        fileDetails: { name: string; size?: number; id?: number };
        isOutputDoc: boolean;
    }) => {
        const [numPages, setNumPages] = useState<number>();
        const [containerWidth] = useState<number>();
        const { showErrorModal } = useErrorModal();
        const { hideLoader, showLoader } = useLoader();

        function onDocumentLoadSuccess({
            numPages,
        }: {
            numPages: number;
        }): void {
            setNumPages(numPages);
        }

        function handleDownload() {
            translateStore.downloadDocument(
                fileDetails.id as number,
                fileDetails.name
            );
        }

        useEffect(() => {
            translateStore.reset();
            return autorun(() => {
                if (translateStore.state === 'error') {
                    showErrorModal(translateStore.errorMessage);
                    hideLoader();
                }
                if (translateStore.state === 'loading') {
                    showLoader();
                }
                if (translateStore.state === 'success') {
                    hideLoader();
                }
            });
        }, []);

        return (
            <>
                {type === 'pdf' ? (
                    <>
                        <Document
                            file={
                                format === 'base64'
                                    ? `data:application/pdf;base64,${file}`
                                    : file
                            }
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
                        {isOutputDoc && (
                            <IconButton
                                sx={{
                                    position: 'absolute',
                                    zIndex: 99,
                                    justifySelf: 'flex-end',
                                    bottom: '35px',
                                    left: '45vw',
                                    width: '50px',
                                    height: '50px',
                                    color: 'white',
                                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                                    },
                                }}
                                onClick={handleDownload}
                            >
                                <DownloadIcon />
                            </IconButton>
                        )}
                    </>
                ) : (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                            width: '100%',
                        }}
                    >
                        <span
                            style={{
                                width: '60%',
                                height: '60%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '10px',
                                border: '1px solid #e0e0e0',
                                flexDirection: 'column',
                                gap: '2rem',
                            }}
                        >
                            <span
                                style={{
                                    width: '60%',
                                    height: '60%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: '10px',
                                    border: '1px solid #e0e0e0',
                                    flexDirection: 'column',
                                }}
                            >
                                <img
                                    src={wordIcon}
                                    alt="word-icon"
                                    style={{
                                        width: '35%',
                                        height: '35%',
                                        boxShadow:
                                            '0 0 10px rgba(0, 0, 0, 0.1)',
                                        margin: '10px',
                                    }}
                                />
                                <span
                                    style={{
                                        fontSize: '1.5rem',
                                        textAlign: 'center',
                                    }}
                                >
                                    {fileDetails.name.split('.')[0] +
                                        `.${type}`}{' '}
                                    {fileDetails.size
                                        ? `${(fileDetails.size / 1024).toFixed(2)} KB`
                                        : ''}
                                </span>
                            </span>
                            {isOutputDoc && (
                                <IconButton
                                    sx={{
                                        position: 'absolute',
                                        zIndex: 99,
                                        justifySelf: 'flex-end',
                                        bottom: '35px',
                                        left: '45vw',
                                        width: '50px',
                                        height: '50px',
                                        color: 'white',
                                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                        '&:hover': {
                                            backgroundColor:
                                                'rgba(0, 0, 0, 0.9)',
                                        },
                                    }}
                                    onClick={handleDownload}
                                >
                                    <DownloadIcon />
                                </IconButton>
                            )}
                        </span>
                    </Box>
                )}
            </>
        );
    }
);

export default PreviewDocument;
