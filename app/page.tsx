'use client';

import { useState } from 'react';
import QRDisplay from '@/components/QRDisplay';
import styles from './page.module.css';

export default function Home() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [error, setError] = useState('');

  const handleShare = async () => {
    if (!content.trim()) {
      setError('Please enter some content to share');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'text',
          content: content.trim(),
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
    setContent('');
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.title}>
            Paste<span className={styles.gradient}>Anywhere</span>
          </h1>
          <p className={styles.subtitle}>
            Copy on one device, paste on any other. Instantly.
          </p>
        </div>

        <div className={`${styles.card} glass`}>
          <div className={styles.inputSection}>
            <label htmlFor="content" className={styles.label}>
              📋 Your Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your text here..."
              className={styles.textarea}
              disabled={loading}
            />
          </div>

          {error && (
            <div className={styles.error}>
              ⚠️ {error}
            </div>
          )}

          <button
            className="btn btn-primary"
            onClick={handleShare}
            disabled={loading || !content.trim()}
          >
            {loading ? (
              <span className={styles.loadingText}>
                <span className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></span>
                Generating QR...
              </span>
            ) : (
              '🚀 Generate QR Code'
            )}
          </button>

          <div className={styles.features}>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>⚡</span>
              <span>Instant sharing</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>🔒</span>
              <span>Auto-expires</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>📱</span>
              <span>Any device</span>
            </div>
          </div>
        </div>

        <footer className={styles.footer}>
          <p>No accounts. No tracking. Just paste.</p>
        </footer>
      </main>

      {shareUrl && <QRDisplay url={shareUrl} onClose={handleCloseQR} />}
    </div>
  );
}
