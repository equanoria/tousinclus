import type { IDirectusCardsGroup } from '@tousinclus/types';
import { useState, useEffect } from 'react';
import { useAppState } from '../../context/AppStateProvider';
import styles from './Deck.module.css';
import { GameCard } from '../../components/GameCard/GameCard';

export const Deck = () => {
  const { directusService, localeManager, gameData } = useAppState();
  const [data, setData] = useState<IDirectusCardsGroup>();

  useEffect(() => {
    const fetchData = async () => {
      if (!gameData?.cardsGroupId) return;

      setData(
        await directusService.getCardsGroup(
          gameData?.cardsGroupId,
          localeManager.getLocale(),
        ),
      );
    };

    fetchData();
  }, [directusService, localeManager, gameData]);

  return (
    <section className={styles.deck}>
      <h1>Préparation du matériel</h1>
      <div>
        <p>1. Placez la carte “situation d’usage” suivante sur le plateau</p>
        <GameCard
          type="situation"
          img="/src/assets/images/train.svg"
          alt="Train"
          number="1"
        />
      </div>
    </section>
  );
};
