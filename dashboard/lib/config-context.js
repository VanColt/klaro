import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { fetchConfig, publishConfig, updateConfig } from '@/lib/remote-api';

const ConfigContext = createContext(null);

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dirty, setDirty] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { config: cfg, meta: metadata } = await fetchConfig();
      setConfig(cfg);
      setMeta(metadata ?? null);
      setDirty(false);
    } catch (err) {
      console.error('Failed to fetch Klaro configuration', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = useCallback(
    async (nextConfig) => {
      setLoading(true);
      setError(null);
      try {
        const { config: savedConfig, meta: savedMeta } = await updateConfig(nextConfig);
        setConfig(savedConfig);
        setMeta(savedMeta ?? null);
        setDirty(false);
        return savedConfig;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const publish = useCallback(
    async (currentConfig) => {
      if (!currentConfig) {
        return null;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await publishConfig(currentConfig);
        setDirty(false);
        return response;
      } catch (err) {
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const contextValue = useMemo(
    () => ({
      config,
      meta,
      loading,
      error,
      dirty,
      setConfig: (nextConfig) => {
        setConfig(nextConfig);
        setDirty(true);
      },
      reload: load,
      save,
      publish,
    }),
    [config, meta, loading, error, dirty, load, save, publish]
  );

  return <ConfigContext.Provider value={contextValue}>{children}</ConfigContext.Provider>;
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used inside ConfigProvider');
  }
  return context;
}
