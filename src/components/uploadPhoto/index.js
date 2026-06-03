import React, { useEffect, useMemo, useRef } from 'react'
import classNames from 'classnames';
import styles from './uploadPhoto.module.scss';
const CameraImage = '/assets/images/camera.png';
const CloseIcon = '/assets/icons/close.svg';

export default function UploadPhoto({
    file = null,
    error = "",
    hasError = false,
    disabled = false,
    multiple = false,
    onFileChange,
    onRemove,
    placeholderTitle = 'Upload Photo',
    placeholderSubTitle = 'Drag & drop or click to select a file',
    placeholderMeta = 'JPG, PNG, WebP (Max 7MB)',
    placeholderNote = '',
    accept = 'image/jpeg,image/jpg,image/png,image/webp',
    className = "",
}) {
    const inputRef = useRef(null);

    const isBlob = file instanceof Blob;

    const previewUrl = useMemo(() => {
        if (!file) return '';
        if (typeof file === 'string') return file;
        if (isBlob) return URL.createObjectURL(file);
        return '';
    }, [file, isBlob]);

    useEffect(() => {
        return () => {
            if (isBlob && previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [isBlob, previewUrl]);

    const canUpload = Boolean(onFileChange) && !disabled;

    const triggerInput = () => {
        if (!canUpload || file) return;
        inputRef.current?.click();
    };

    const handleFileSelect = (selectedFile) => {
        onFileChange?.(selectedFile || null);
    };

    const handleDrop = (event) => {
        if (!canUpload) return;
        event.preventDefault();
        if (multiple) {
            const files = Array.from(event.dataTransfer?.files || []);
            if (files.length) onFileChange?.(files);
        } else {
            const selectedFile = event.dataTransfer?.files?.[0] || null;
            handleFileSelect(selectedFile);
        }
    };

    const handleDragOver = (event) => {
        if (!canUpload) return;
        event.preventDefault();
    };

    const handleRemove = (event) => {
        event.stopPropagation();
        if (onRemove) {
            onRemove();
            return;
        }
        onFileChange?.(null);
    };

    return (
        <div
            className={classNames(
                styles.uploadPhoto,
                file ? styles.filled : "",
                error || hasError ? styles.error : "",
                disabled ? styles.disabled : "",
                className,
            )}
            onClick={triggerInput}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
        >
            {file && previewUrl ? (
                <div className={styles.previewWrapper}>
                    <img src={previewUrl} alt="Uploaded Preview" className={styles.previewImage} />
                    {!disabled ? (
                        <button type="button" className={styles.removeButton} onClick={handleRemove}>
                            <img src={CloseIcon} alt="Remove" />
                        </button>
                    ) : null}
                </div>
            ) : (
                <div>
                    <div className={styles.iconCenter}>
                        <img src={CameraImage} alt='CameraImage' />
                    </div>
                    <h4>
                        {placeholderTitle}
                    </h4>
                    <p>
                        {placeholderSubTitle}
                    </p>
                    <p>
                        {placeholderMeta}
                    </p>
                    {placeholderNote ? (
                        <div className={styles.noteBox}>
                            <svg className={styles.noteIcon} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 1C4.13438 1 1 4.13438 1 8C1 11.8656 4.13438 15 8 15C11.8656 15 15 11.8656 15 8C15 4.13438 11.8656 1 8 1ZM8.5 11.5H7.5V7H8.5V11.5ZM8 6C7.72386 6 7.5 5.77614 7.5 5.5C7.5 5.22386 7.72386 5 8 5C8.27614 5 8.5 5.22386 8.5 5.5C8.5 5.77614 8.27614 6 8 6Z" fill="currentColor"/>
                            </svg>
                            <span>{placeholderNote}</span>
                        </div>
                    ) : null}
                </div>
            )}
            {onFileChange ? (
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    className={styles.hiddenInput}
                    onClick={(event) => event.stopPropagation()}
                    onChange={(event) => {
                        if (multiple) {
                            const files = Array.from(event.target.files || []);
                            if (files.length) onFileChange?.(files);
                        } else {
                            const selectedFile = event.target.files?.[0] || null;
                            handleFileSelect(selectedFile);
                        }
                        event.target.value = "";
                    }}
                />
            ) : null}
            {error ? (
                <p className={styles.errorText}>{error}</p>
            ) : null}
        </div>
    )
}
