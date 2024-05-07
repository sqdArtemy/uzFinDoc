import styles from './DnD.module.scss';
import { useState } from 'react';
import uploadImg from '../../../assets/upload.png';

export function DnD({ setFile }) {
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const validateFile = function (file) {
        if (file.size > 300000000) {
            console.log('Max file size is 300 MB');
            return false;
        }
        return true;
    };

    const handleDrop = function (e) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            if (!validateFile(e.dataTransfer.files[0])) return;
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = function (e) {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            if (!validateFile(e.target.files[0])) return;
            setFile(e.target.files[0]);
        }
    };

    return (
        <form
            className={styles.formFileUpload}
            onDragEnter={handleDrag}
            onSubmit={(e) => e.preventDefault()}
        >
            <input
                type="file"
                className={styles.inputFileUpload}
                accept=".docx,.pdf,.doc"
                id="input-file-upload"
                multiple={true}
                onChange={handleChange}
            />
            <label
                id="label-file-upload"
                htmlFor="input-file-upload"
                className={`${styles.labelFileUpload} ${dragActive ? styles.dragActive : ''}`}
                style={{ cursor: 'pointer' }}
            >
                <div className={styles.uploadContentContainer}>
                    <img src={uploadImg} alt="upload" />
                    <span>Upload your file</span>
                    <span className={styles.textGrey}>.PDF .DOCX .DOC</span>
                    <span className={styles.textGrey}>
                        *Max file size 300 MB
                    </span>
                </div>
            </label>
            {dragActive && (
                <div
                    className={styles.dragFileElement}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                ></div>
            )}
        </form>
    );
}
