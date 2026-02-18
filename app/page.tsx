'use client';

import { useState } from 'react';
import QRDisplay from '@/components/QRDisplay';
import styles from './page.module.css';
import { DIRECT_QR_THRESHOLD, getByteSize } from '@/lib/utils';

export default function Home() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [directContent, setDirectContent] = useState('');
  const [error, setError] = useState('');

  const handleShare = async () => {
    if (!content.trim()) {
      setError('Please enter some content to share');
      return;
    }

    const trimmed = content.trim();
    setLoading(true);
    setError('');

    try {
      // Short content: encode directly in the QR — no server call needed
      if (getByteSize(trimmed) <= DIRECT_QR_THRESHOLD) {
        setDirectContent(trimmed);
        setLoading(false);
        return;
      }

      // Long content: store in Redis and encode the share URL
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'text',
          content: trimmed,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to share content');
      }

      const data = await response.json();
      setShareUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseQR = () => {
    setShareUrl('');
    setDirectContent('');
    setContent('');
  };

  return (
    <div className={styles.container}>
      <main className={`${styles.main} animate-entrance`}>
        <header className={styles.hero}>
          <h1 className={styles.title}>
            Paste<span className={styles.accent}>Anywhere</span>
          </h1>
          <p className={styles.subtitle}>
            Instantly sync text content across all your devices using QR codes. No accounts, no hassle.
          </p>
        </header>

        <section className={`${styles.card} glass animate-float`}>
          <div className={styles.inputSection}>
            <label htmlFor="content" className={styles.label}>
              <span>📝</span> Your content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type or paste anything here..."
              className={styles.textarea}
              disabled={loading}
            />
          </div>

          <div className={styles.actionSection}>
            {error && (
              <div className={styles.error}>
                <span>⚠️</span> {error}
              </div>
            )}

            <button
              className="btn btn-primary"
              style={{ width: '100%' }}
              onClick={handleShare}
              disabled={loading || !content.trim()}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <span>✨</span>
                  <span>Generate QR Access</span>
                </>
              )}
            </button>
          </div>

          <div className={styles.features}>
            <div className={styles.badge}>
              <span>⚡</span> <span>Fast</span>
            </div>
            <div className={styles.badge}>
              <span>🔒</span> <span>Secure</span>
            </div>
            <div className={styles.badge}>
              <span>📱</span> <span>Cross-device</span>
            </div>
          </div>
        </section>

        <footer className={styles.footer}>
          <p>Privacy focused. Multi-device sync.</p>
        </footer>
      </main>

      {(shareUrl || directContent) && (
        <QRDisplay
          url={shareUrl || undefined}
          content={directContent || undefined}
          onClose={handleCloseQR}
        />
      )}
    </div>
  );
}

