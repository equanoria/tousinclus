import clsx from 'clsx';
import type React from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import styles from './Deck.module.css';
import { GameCard } from '../GameCard/GameCard';
import type { IDirectusCardsGroup } from '@tousinclus/types';
import { directusService } from '../../services/directus/directus.service';
import { Button } from '../Button/Button';
import { IconArrowRight } from '@tabler/icons-react';

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
  if (!cardsGroup) return null;

  const usageSituation = cardsGroup.usage_situation;
  const extremeUsers = cardsGroup?.extreme_user ?? [];

  return (
    <section
      className={classes}
      aria-label="Préparation du matériel"
      {...props}
    >
      <h1>Préparation du matériel</h1>

      <div className={styles.deckContainer}>
        <fieldset
          className={styles.usageSituationContainer}
          aria-labelledby="usage-situation-title"
        >
          <legend id="usage-situation-title" className={styles.legend}>
            Placez la carte “situation d’usage” suivante sur le plateau
          </legend>
          {usageSituation && (
            <GameCard
              key="situation"
              type="situation"
              img={directusService.getAssetUrl(usageSituation.image)}
              alt={
                usageSituation.context_translations?.[0]?.context ??
                usageSituation.description_translations?.[0]?.description ??
                'Carte situation d’usage'
              }
              number={usageSituation.id}
            />
          )}
        </fieldset>

        <fieldset
          className={styles.extremeUsersContainer}
          aria-labelledby="extreme-users-title"
        >
          <legend id="extreme-users-title" className={styles.legend}>
            Placez les cartes “utilisateur extrême” suivantes sur le plateau
          </legend>
          <div className={styles.extremeUsers}>
            {extremeUsers.map((userData) => {
              const user = userData.cards_users_id;
              const description =
                user.translations?.[0]?.description ?? 'Utilisateur extrême';
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
        </fieldset>

        <div className={styles.bottomContainer}>
          <div className={styles.cardsToDrawContainer}>
            <h2>Piochez 4 cartes “concevoir pour tous”</h2>
            <img
              src="/src/assets/images/cards.svg"
              alt=""
              aria-hidden="true"
              className={styles.cardsImg}
            />
          </div>
          {onStart && (
            <Button
              variant="primary"
              onClick={onStart}
              endIcon={<IconArrowRight aria-hidden="true" />}
              aria-label="Commencer la partie"
            >
              Commencer la partie
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};
