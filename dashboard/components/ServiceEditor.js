import { useEffect, useMemo, useState } from 'react';
import styles from '@/styles/ServiceEditor.module.css';

const defaultService = {
  name: '',
  title: '',
  description: '',
  purposes: [],
  required: false,
  default: false,
  optOut: false,
};

export function ServiceEditor({
  service,
  onSave,
  onCancel,
  onCreate,
  isNew = false,
  existingNames = [],
}) {
  const [draft, setDraft] = useState(() => ({ ...defaultService, ...service }));
  const [purposeInput, setPurposeInput] = useState('');

  useEffect(() => {
    setDraft({ ...defaultService, ...service });
    setPurposeInput('');
  }, [service]);

  const isValid = useMemo(() => {
    if (!draft.name || !draft.title) {
      return false;
    }
    const duplicate = existingNames.includes(draft.name) && draft.name !== service?.name;
    return !duplicate;
  }, [draft.name, draft.title, existingNames, service?.name]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isValid) {
      return;
    }
    if (isNew) {
      onCreate(draft);
    } else {
      onSave(draft, service?.name);
    }
  };

  const handleAddPurpose = () => {
    const trimmed = purposeInput.trim();
    if (!trimmed || draft.purposes.includes(trimmed)) {
      return;
    }
    setDraft((current) => ({ ...current, purposes: [...current.purposes, trimmed] }));
    setPurposeInput('');
  };

  const handleRemovePurpose = (purpose) => {
    setDraft((current) => ({
      ...current,
      purposes: current.purposes.filter((item) => item !== purpose),
    }));
  };

  return (
    <section className={styles.editor}>
      <header>
        <h2>{isNew ? 'Add new service' : `Edit ${service?.title || service?.name}`}</h2>
        <p>Update service metadata, defaults, and purposes.</p>
      </header>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.fieldGroup}>
          <label htmlFor="service-name">Name</label>
          <input
            id="service-name"
            value={draft.name}
            onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
            placeholder="e.g. google-analytics"
            required
          />
          {existingNames.includes(draft.name) && draft.name !== service?.name && (
            <p className={styles.error}>A service with this name already exists.</p>
          )}
        </div>
        <div className={styles.fieldGroup}>
          <label htmlFor="service-title">Title</label>
          <input
            id="service-title"
            value={draft.title}
            onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
            placeholder="Google Analytics"
            required
          />
        </div>
        <div className={styles.fieldGroup}>
          <label htmlFor="service-description">Description</label>
          <textarea
            id="service-description"
            value={draft.description}
            onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))}
            rows={3}
            placeholder="Explain what this service does and why consent is required."
          />
        </div>
        <fieldset className={styles.switches}>
          <legend>Consent behaviour</legend>
          <label>
            <input
              type="checkbox"
              checked={draft.required}
              onChange={(event) => setDraft((current) => ({ ...current, required: event.target.checked }))}
            />
            Required service
          </label>
          <label>
            <input
              type="checkbox"
              checked={draft.default}
              onChange={(event) => setDraft((current) => ({ ...current, default: event.target.checked }))}
            />
            Enabled by default
          </label>
          <label>
            <input
              type="checkbox"
              checked={draft.optOut}
              onChange={(event) => setDraft((current) => ({ ...current, optOut: event.target.checked }))}
            />
            Opt-out only
          </label>
        </fieldset>
        <div className={styles.fieldGroup}>
          <label>Purposes</label>
          <div className={styles.purposeInputRow}>
            <input
              value={purposeInput}
              onChange={(event) => setPurposeInput(event.target.value)}
              placeholder="analytics"
            />
            <button type="button" onClick={handleAddPurpose}>
              Add
            </button>
          </div>
          <ul className={styles.purposeList}>
            {draft.purposes.map((purpose) => (
              <li key={purpose}>
                {purpose}
                <button type="button" onClick={() => handleRemovePurpose(purpose)}>
                  Remove
                </button>
              </li>
            ))}
            {!draft.purposes.length && <li className={styles.empty}>No purposes added yet.</li>}
          </ul>
        </div>
        <div className={styles.footer}>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className={styles.primary} disabled={!isValid}>
            {isNew ? 'Create service' : 'Save changes'}
          </button>
        </div>
      </form>
    </section>
  );
}
