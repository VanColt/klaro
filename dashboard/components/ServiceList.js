import clsx from 'clsx';
import { PurposeBadges } from '@/components/PurposeBadges';
import styles from '@/styles/ServiceList.module.css';

export function ServiceList({ services = [], selectedService, onSelectService, onRemoveService }) {
  return (
    <section className={styles.services}>
      <header className={styles.header}>
        <h2>Services</h2>
        <p>Configure integrations that require user consent.</p>
      </header>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Name</th>
              <th scope="col">Purposes</th>
              <th scope="col">Required</th>
              <th scope="col">Default</th>
              <th scope="col" className={styles.actionsHeader}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 && (
              <tr>
                <td colSpan={6} className={styles.empty}>
                  No services configured yet.
                </td>
              </tr>
            )}
            {services.map((service) => (
              <tr
                key={service.name}
                className={clsx({ [styles.selected]: selectedService?.name === service.name })}
              >
                <td>{service.title || 'Untitled service'}</td>
                <td>{service.name}</td>
                <td>
                  <PurposeBadges purposes={service.purposes} />
                </td>
                <td>{service.required ? 'Yes' : 'No'}</td>
                <td>{service.default ? 'Enabled' : 'Disabled'}</td>
                <td className={styles.actions}>
                  <button type="button" onClick={() => onSelectService(service.name)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className={styles.danger}
                    onClick={() => onRemoveService(service.name)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
