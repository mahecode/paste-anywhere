'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import styles from './page.module.css';

interface ContentData {
    type: 'text' | 'image';
    content: string;
    createdAt: number;
}

export default function ReceivePage() {
    const params = useParams();
    const id = params.id as string;

    const [content, setContent] = useState<ContentData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    // clear content on unmount
    useEffect(() => {
        return () => {
            setContent(null);
        };
    }, [id]);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await fetch(`/api/get/${id}`);

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.error || 'Failed to retrieve content');
                }

                const data = await response.json();
                setContent(data);
            } catch (err) {
                // If error is due to expiry/already accessed, show error
                setError(err instanceof Error ? err.message : 'Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchContent();
        }
    }, [id]);

    const handleCopy = async () => {
        if (!content) return;

        try {
            await navigator.clipboard.writeText(content.content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingContainer}>
                    <div className="spinner"></div>
                    <p className={styles.loadingText}>Loading content...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={`${styles.card} glass`}>
                    <div className={styles.errorIcon}>⚠️</div>
                    <h1 className={styles.errorTitle}>Content Not Found</h1>
                    <p className={styles.errorMessage}>{error}</p>
                    <p className={styles.errorHint}>
                        This shared content has either expired (5 mins) or has already been accessed.
                    </p>
                    <a href="/" className="btn btn-primary" style={{ marginTop: '24px', display: 'inline-block' }}>
                        Create New Share
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={`${styles.card} glass`}>
                <div className={styles.header}>
                    <h1 className={styles.title}>
                        Your <span className={styles.gradient}>Content</span>
                    </h1>
                    <p className={styles.subtitle}>
                        This content will be deleted after you copy it
                    </p>
                </div>

                <div className={styles.contentBox}>
                    {content?.type === 'text' && (
                        <pre className={styles.textContent}>{content.content}</pre>
                    )}
                </div>

                <button
                    className="btn btn-primary"
                    onClick={handleCopy}
                    style={{ width: '100%' }}
                >
                    {copied ? '✓ Copied to Clipboard!' : '📋 Copy to Clipboard'}
                </button>

                <div className={styles.footer}>
                    <p className={styles.timestamp}>
                        Shared {new Date(content?.createdAt || 0).toLocaleTimeString()}
                    </p>
                    <a href="/" className={styles.link}>
                        Create your own share →
                    </a>
                </div>
            </div>
        </div>
    );
}
