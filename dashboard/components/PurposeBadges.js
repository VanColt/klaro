import clsx from 'clsx';
import styles from '@/styles/PurposeBadges.module.css';

export function PurposeBadges({ purposes = [] }) {
  if (!purposes.length) {
    return <span className={styles.empty}>No purposes</span>;
  }
  return (
    <ul className={styles.list}>
      {purposes.map((purpose) => (
        <li key={purpose} className={clsx(styles.purpose)}>
          {purpose}
        </li>
      ))}
    </ul>
  );
}
