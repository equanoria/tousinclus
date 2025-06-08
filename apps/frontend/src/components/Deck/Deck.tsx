import { IconArrowRight } from '@tabler/icons-react';
import type { IDirectusCardsGroup } from '@tousinclus/types';
import clsx from 'clsx';
import type React from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import { directusService } from '../../services/directus/directus.service';
import { Button } from '../Button/Button';
import { GameCard } from '../GameCard/GameCard';
import styles from './Deck.module.css';

export interface DeckProps extends ComponentPropsWithoutRef<'section'> {
  cardsGroup?: IDirectusCardsGroup;
  onStart?: () => void;
}

export const Deck: React.FC<DeckProps> = ({
  className,
  cardsGroup,
  onStart,
  ...props
}) => {
  const classes = clsx(styles.deck, className);
  if (!cardsGroup) return;
  const usageSituation = cardsGroup.usage_situation;
  const extremeUsers = cardsGroup?.extreme_user ?? [];
  return (
    <section className={classes} {...props}>
      <h1>Préparation du matériel</h1>
      <div className={styles.deckContainer}>
        <div className={styles.usageSituationContainer}>
          <h2>Placez la carte “situation d’usage” suivante sur le plateau</h2>
          {usageSituation && (
            <GameCard
              key="situation"
              type="situation"
              img={directusService.getAssetUrl(usageSituation.image)}
              alt={
                usageSituation.context_translations?.[0]?.context ??
                usageSituation.description_translations?.[0]?.description ??
                'Situation'
              }
              number={usageSituation.id}
            />
          )}
        </div>
        <div className={styles.extremeUsersContainer}>
          <h2>
            Placez les cartes “utilisateur extrême” suivantes sur le plateau
          </h2>
          <div className={styles.extremeUsers}>
            {extremeUsers.map((userData) => {
              const user = userData.cards_users_id;
              const description = user.translations?.[0]?.description ?? '';
              const image = user.image;
              return (
                <GameCard
                  key={user.id}
                  type="user"
                  img={directusService.getAssetUrl(image)}
                  alt={description}
                  number={user.id}
                />
              );
            })}
          </div>
        </div>
        <div className={styles.bottomContainer}>
          <div className={styles.cardsToDrawContainer}>
            <h2>Piochez 4 cartes “concevoir pour tous”</h2>
            <img
              src="/src/assets/images/cards.svg"
              alt=""
              className={styles.cardsImg}
            />
          </div>
          {onStart && (
            <Button
              variant="primary"
              onClick={onStart}
              endIcon={<IconArrowRight />}
            >
              Commencer la partie
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};
