import Head from 'next/head';
import styles from '@/styles/Layout.module.css';

export function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Klaro CMP Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className={styles.root}>
        <header className={styles.header}>
          <div>
            <h1>Klaro CMP Dashboard</h1>
            <p>Manage remote consent configurations and services.</p>
          </div>
          <a
            href="https://github.com/KIProtect/klaro"
            target="_blank"
            rel="noreferrer"
            className={styles.repoLink}
          >
            View repository
          </a>
        </header>
        <main className={styles.main}>{children}</main>
      </div>
    </>
  );
}
