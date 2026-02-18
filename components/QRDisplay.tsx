'use client';

import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';
import styles from './QRDisplay.module.css';

interface QRDisplayProps {
    url?: string;
    content?: string;
    onClose: () => void;
}

export default function QRDisplay({ url, content, onClose }: QRDisplayProps) {
    const [copied, setCopied] = useState(false);

    // Direct-content mode when `content` is provided; URL mode otherwise
    const isDirect = Boolean(content);
    const qrValue = content ?? url ?? '';

    const handleCopyUrl = async () => {
        try {
            await navigator.clipboard.writeText(url ?? '');
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

                <h2 className={styles.title}>
                    {isDirect ? 'Scan to paste' : 'Ready to sync'}
                </h2>
                <p className={styles.subtitle}>
                    {isDirect
                        ? 'Content is embedded directly in this QR — no server, no expiry.'
                        : 'Scan this QR code from any device to access your shared content instantly.'}
                </p>

                <div className={styles.qrContainer}>
                    <QRCodeSVG
                        value={qrValue}
                        size={240}
                        level={isDirect ? 'M' : 'H'}
                        includeMargin={false}
                        bgColor="#ffffff"
                        fgColor="#000000"
                    />
                </div>

                {isDirect ? (
                    <p className={styles.expiry}>
                        <span>⚡</span> Serverless &amp; permanent — works offline
                    </p>
                ) : (
                    <>
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
                                {copied ? '✓ Copied' : 'Copy link'}
                            </button>
                        </div>

                        <p className={styles.expiry}>
                            <span>⏱️</span> Expires in 5 minutes or after first access
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}

