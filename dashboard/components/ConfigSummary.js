import styles from '@/styles/ConfigSummary.module.css';

export function ConfigSummary({ config, meta, onReload, onSave, onPublish, loading, dirty }) {
  return (
    <section className={styles.summary}>
      <div>
        <h2>Configuration</h2>
        <dl className={styles.metrics}>
          <div>
            <dt>Name</dt>
            <dd>{config?.name ?? '—'}</dd>
          </div>
          <div>
            <dt>Version</dt>
            <dd>{config?.version ?? '—'}</dd>
          </div>
          <div>
            <dt>Services</dt>
            <dd>{config?.services?.length ?? 0}</dd>
          </div>
        </dl>
        {meta?.etag && (
          <p className={styles.meta}>
            <strong>ETag:</strong> {meta.etag}
          </p>
        )}
        {meta?.generated_at && (
          <p className={styles.meta}>
            <strong>Generated:</strong> {new Date(meta.generated_at).toLocaleString()}
          </p>
        )}
      </div>
      <div className={styles.actions}>
        <button type="button" onClick={onReload} disabled={loading}>
          Reload from backend
        </button>
        <button type="button" className={styles.primary} onClick={onSave} disabled={!dirty || loading}>
          Save configuration
        </button>
        {onPublish && (
          <button
            type="button"
            className={styles.publish}
            onClick={onPublish}
            disabled={loading || dirty}
          >
            Publish draft
          </button>
        )}
      </div>
    </section>
  );
}
