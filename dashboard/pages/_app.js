import '@/styles/globals.css';
import { ConfigProvider } from '@/lib/config-context';

export default function App({ Component, pageProps }) {
  return (
    <ConfigProvider>
      <Component {...pageProps} />
    </ConfigProvider>
  );
}
