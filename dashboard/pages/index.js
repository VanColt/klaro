import { useEffect, useMemo, useState } from 'react';
import { Layout } from '@/components/Layout';
import { ConfigSummary } from '@/components/ConfigSummary';
import { ServiceEditor } from '@/components/ServiceEditor';
import { ServiceList } from '@/components/ServiceList';
import { useConfig } from '@/lib/config-context';
import styles from '@/styles/Home.module.css';

export default function Home() {
  const { config, meta, loading, error, dirty, setConfig, reload, save, publish } = useConfig();
  const [selectedServiceName, setSelectedServiceName] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const services = config?.services ?? [];
  const selectedService = useMemo(
    () => services.find((service) => service.name === selectedServiceName) ?? null,
    [services, selectedServiceName]
  );
  const serviceNames = useMemo(() => services.map((service) => service.name), [services]);
  const firstServiceName = services[0]?.name ?? null;

  useEffect(() => {
    if (!config) {
      setSelectedServiceName(null);
      return;
    }
    if (!isCreating && firstServiceName && !selectedServiceName) {
      setSelectedServiceName(firstServiceName);
      return;
    }
    if (!firstServiceName) {
      setSelectedServiceName(null);
    }
  }, [config, firstServiceName, selectedServiceName, isCreating]);

  const handleSelectService = (name) => {
    setSelectedServiceName(name);
    setIsCreating(false);
  };

  const handleRemoveService = (name) => {
    if (!config) return;
    const nextServices = services.filter((service) => service.name !== name);
    setConfig({ ...config, services: nextServices });
    if (selectedServiceName === name) {
      setSelectedServiceName(null);
    }
  };

  const handleUpdateService = (draft, originalName) => {
    if (!config) return;
    const targetName = originalName ?? draft.name;
    const nextServices = services.map((service) =>
      service.name === targetName ? { ...service, ...draft } : service
    );
    setConfig({ ...config, services: nextServices });
    setSelectedServiceName(draft.name);
  };

  const handleCreateService = (draft) => {
    if (!config) return;
    const nextServices = [...services, { ...draft }];
    setConfig({ ...config, services: nextServices });
    setSelectedServiceName(draft.name);
    setIsCreating(false);
  };

  const handleAddService = () => {
    setIsCreating(true);
    setSelectedServiceName(null);
  };

  const handleCancelEdit = () => {
    setIsCreating(false);
    if (firstServiceName) {
      setSelectedServiceName(firstServiceName);
    } else {
      setSelectedServiceName(null);
    }
  };

  const handleSaveConfig = async () => {
    if (!config) return;
    await save(config);
  };

  const handlePublishConfig = async () => {
    if (!config) return;
    await publish(config);
  };

  return (
    <Layout>
      <div className={styles.container}>
        <ConfigSummary
          config={config}
          meta={meta}
          loading={loading}
          dirty={dirty}
          onReload={reload}
          onSave={handleSaveConfig}
          onPublish={config ? handlePublishConfig : undefined}
        />
        {error && <p className={styles.error}>Failed to load configuration: {error.message}</p>}
        <div className={styles.dashboard}>
          <div className={styles.column}>
            <div className={styles.columnHeader}>
              <button type="button" className={styles.primary} onClick={handleAddService}>
                Add service
              </button>
            </div>
            <ServiceList
              services={services}
              selectedService={selectedService}
              onSelectService={handleSelectService}
              onRemoveService={handleRemoveService}
            />
          </div>
          <div className={styles.column}>
            {(selectedService || isCreating) && config ? (
              <ServiceEditor
                key={selectedService ? selectedService.name : 'new'}
                service={selectedService ?? { name: '', title: '', purposes: [] }}
                onSave={handleUpdateService}
                onCreate={handleCreateService}
                onCancel={handleCancelEdit}
                isNew={isCreating}
                existingNames={serviceNames}
              />
            ) : (
              <div className={styles.placeholder}>
                <h2>Select a service to edit</h2>
                <p>Choose a service from the list or add a new service to configure its details.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
