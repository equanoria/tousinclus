import clsx from 'clsx';
import type React from 'react';
import type { ComponentPropsWithoutRef } from 'react';
import styles from './Deck.module.css';
import { GameCard } from '../GameCard/GameCard';
import type { IDirectusCardsGroup } from '@tousinclus/types';
import { directusService } from '../../services/directus/directus.service';
import { Button } from '../Button/Button';

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

  const usageSituation = cardsGroup?.usage_situation;
  const extremeUsers = cardsGroup?.extreme_user ?? [];
console.log('Deck', { usageSituation });
  return (
    <section className={classes} {...props}>
      {/* Carte de situation */}
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

      {/* Cartes utilisateurs */}
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
      {onStart && (
        <Button variant="primary" onClick={onStart}>
          Commencer la partie
        </Button>
      )}
    </section>
  );
};
