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
    onFileChange,
    onRemove,
    placeholderTitle = 'Upload Photo',
    placeholderSubTitle = 'Drag & drop or click to select a file',
    placeholderMeta = 'JPG, PNG, WebP (Max 7MB)',
    accept = 'image/jpeg,image/jpg,image/png,image/webp',
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
        const selectedFile = event.dataTransfer?.files?.[0] || null;
        handleFileSelect(selectedFile);
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
                </div>
            )}
            {onFileChange ? (
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    className={styles.hiddenInput}
                    onClick={(event) => event.stopPropagation()}
                    onChange={(event) => {
                        const selectedFile = event.target.files?.[0] || null;
                        handleFileSelect(selectedFile);
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
