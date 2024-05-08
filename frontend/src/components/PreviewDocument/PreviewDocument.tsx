import { observer } from 'mobx-react';
import { Document, Page } from 'react-pdf';
import { useState } from 'react';
import wordIcon from '../../assets/word-icon.png';

const maxWidth = 800;

const PreviewDocument = observer(
    ({
        file,
        type,
        format,
        fileDetails,
    }: {
        file: string | ArrayBuffer | File | null;
        type: string;
        format: string;
        fileDetails: { name: string; size?: number };
    }) => {
        const [numPages, setNumPages] = useState<number>();
        const [containerWidth] = useState<number>();

        function onDocumentLoadSuccess({
            numPages,
        }: {
            numPages: number;
        }): void {
            setNumPages(numPages);
        }

        return type === 'pdf' ? (
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
        ) : (
            <span
                style={{
                    width: '60%',
                    height: '60%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '10px',
                    border: '1px solid #e0e0e0',
                    alignSelf: 'center',
                    flexDirection: 'column',
                    gap: '2rem',
                }}
            >
                <img
                    src={wordIcon}
                    alt="word-icon"
                    style={{
                        width: '35%',
                        height: '35%',
                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
                        margin: '10px',
                    }}
                />
                <span
                    style={{
                        fontSize: '1.5rem',
                        textAlign: 'center',
                    }}
                >
                    {fileDetails.name + `.${type}`}{' '}
                    {fileDetails.size
                        ? `${(fileDetails.size / 1024).toFixed(2)} KB`
                        : ''}
                </span>
            </span>
        );
    }
);

export default PreviewDocument;
