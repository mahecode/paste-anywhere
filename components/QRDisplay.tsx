'use client';

import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';
import styles from './QRDisplay.module.css';

interface QRDisplayProps {
    url: string;
    onClose: () => void;
}

export default function QRDisplay({ url, onClose }: QRDisplayProps) {
    const [copied, setCopied] = useState(false);

    const handleCopyUrl = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy URL:', error);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose}>
                    ✕
                </button>

                <h2 className={styles.title}>Scan to Access</h2>
                <p className={styles.subtitle}>
                    Scan this QR code from any device to access your content
                </p>

                <div className={styles.qrContainer}>
                    <QRCodeSVG
                        value={url}
                        size={280}
                        level="H"
                        includeMargin={true}
                        bgColor="#ffffff"
                        fgColor="#000000"
                    />
                </div>

                <div className={styles.urlContainer}>
                    <input
                        type="text"
                        value={url}
                        readOnly
                        className={styles.urlInput}
                    />
                    <button
                        className={`btn btn-secondary ${styles.copyBtn}`}
                        onClick={handleCopyUrl}
                    >
                        {copied ? '✓ Copied!' : 'Copy URL'}
                    </button>
                </div>

                <p className={styles.expiry}>
                    ⏱️ Expires in 5 minutes or after first access
                </p>
            </div>
        </div>
    );
}
