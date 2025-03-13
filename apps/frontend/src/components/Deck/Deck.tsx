import clsx from 'clsx';
import type React from 'react';
import { ComponentPropsWithoutRef } from 'react';
import styles from './Deck.module.css';
import { useAppState } from '../../context/AppStateProvider';
import { Button } from '../Button/Button';
import { GameCard } from '../GameCard/GameCard';

export interface DeckProps extends ComponentPropsWithoutRef<'section'> {
  deck: {
    title: string;
    situation: { image: string; context: string; description: string };
    users: { image: string; context: string; description: string }[];
  };
}

export const Deck: React.FC<DeckProps> = ({ className, deck }) => {
  const { isDeckOpen, setDeckOpen, isDeckFirstOpen, setDeckFirstOpen } = useAppState();
  const classes = clsx(styles.blocDeck, className, { [styles.open]: isDeckOpen });

  const handleClose = () => {
    if (isDeckFirstOpen) {
      setDeckFirstOpen(false);
    }
    setDeckOpen(false);
  };

  return (
    <section className={classes}>
      <div className={styles.btnContainer}>
        {isDeckFirstOpen ? (
          <Button onClick={handleClose} variant='primary'>Commencer la partie</Button>
        ) : (
          <button onClick={handleClose} className={styles.closeBtn}>Fermer</button>
        )}
      </div>
      <div className={styles.content}>
        <div className={styles.explanation}>
          <p>Bienvenue dans votre deck !</p>
          <p>
            Votre deck se compose de 7 cartes : 1 carte situation d'usage et 6 cartes utilisateur extrême.
            Vous pourrez retrouver ce deck virtuel tout au long de votre partie.
            À vous de les retrouver dans votre jeu physique pour reconstituer ce deck !
          </p>
        </div>
        <GameCard type='situation' size='m' img={deck.situation.image} alt={deck.situation.context} content={deck.situation.description} />
        
        {deck.users.map((user, index) => (
          <GameCard key={index} type='user' size='m' img={user.image} alt={user.context} content={user.description} />
        ))}
      </div>
    </section>
  );
};
