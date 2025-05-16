import type { IDirectusCardsGroup } from '@tousinclus/types';
import { useState, useEffect } from 'react';
import { useAppState } from '../../context/AppStateProvider';

export const GameReflection = () => {
  const { directusService, localeManager, gameData } = useAppState();
  const [data, setData] = useState<IDirectusCardsGroup>();

  useEffect(() => {
    const fetchData = async () => {
      if (!gameData?.cardsGroupId) return;

      setData(
        await directusService.getCardsGroup(gameData?.cardsGroupId, localeManager.getLocale()),
      );
    };

    fetchData();
  }, [directusService, localeManager, gameData]);

  return (
    <>
      <h1>Game Reflection</h1>
      <img src={data ? directusService.getAssetUrl(data.usage_situation.image) : ''} alt="" />
      <code>{data ? JSON.stringify(data) : 'Chargement...'}</code>
    </>
  );
};
