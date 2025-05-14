import { useEffect, useState } from "react";
import { useAppState } from "../../context/AppStateProvider";

export const TestView = () => {
  const { directusService, localeManager } = useAppState();
  const [config, setConfig] = useState<unknown>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      const configData = await directusService.getCardsGroup(
        '14',
        localeManager.getLocale(),
      );
      setConfig(configData);
    };
  
    fetchConfig();
  }, [directusService, localeManager]);

  return (
    <>
      <h1>Test</h1>
      <code>{config ? JSON.stringify(config) : "Chargement..."}</code>
    </>
  );
};