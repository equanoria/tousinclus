import { useState, useEffect } from 'react';
import styles from './GameReflection.module.css';
import { Deck } from '../../components/Deck/Deck';
import { useAppState } from '../../context/AppStateProvider';
import { CardText } from '../../components/CardText/CardText';
import { ProgressBar } from '../../components/ProgressBar/ProgressBar';
import { IndicatorCard } from '../../components/IndicatorCard/IndicatorCard';
import { Button } from '../../components/Button/Button';
import { IconArrowNarrowLeft, IconArrowNarrowRight } from '@tabler/icons-react';
import { Textarea } from '../../components/Textarea/Textarea';
import { InputCheckboxes } from '../../components/InputCheckboxes/InputCheckboxes';

const deck = {
  title: "Group One",
  situation: {
    image: "9a112b7b-efe1-4d8f-a27f-d9c80563e363",
    context: "At the hotel",
    description: "I need to get the keys to my room and go to my room upstairs."
  },
  users: [
    {
      image: "9a112b7b-efe1-4d8f-a27f-d9c80563e363",
      context: "At the hotel",
      description: "User 1: I need to get the keys to my room and go to my room upstairs."
    },
    {
      image: "9a112b7b-efe1-4d8f-a27f-d9c80563e363",
      context: "At the hotel",
      description: "User 2: I need to get the keys to my room and go to my room upstairs."
    },
    {
      image: "9a112b7b-efe1-4d8f-a27f-d9c80563e363",
      context: "At the hotel",
      description: "User 3: I need to get the keys to my room and go to my room upstairs."
    },
    {
      image: "9a112b7b-efe1-4d8f-a27f-d9c80563e363",
      context: "At the hotel",
      description: "User 4: I need to get the keys to my room and go to my room upstairs."
    },
    {
      image: "9a112b7b-efe1-4d8f-a27f-d9c80563e363",
      context: "At the hotel",
      description: "User 5: I need to get the keys to my room and go to my room upstairs."
    },
    {
      image: "9a112b7b-efe1-4d8f-a27f-d9c80563e363",
      context: "At the hotel",
      description: "User 6: I need to get the keys to my room and go to my room upstairs."
    }
  ]
};

export const GameReflection = () => {
  const { isDeckOpen, setDeckOpen } = useAppState();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setDeckOpen(true);
  }, [setDeckOpen]);

  const handleNext = () => {
    if (currentIndex < deck.users.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className={styles.pageReflection}>
      <div className={`${styles.pageReflection} ${isDeckOpen ? styles.hiddenWhenDeckOpen : ''}`}>
        <img src="/assets/asset-reflection.svg" alt="" className={styles.asset} />
        <div className={styles.containerTop}>    
          <CardText type='situation' content={deck.situation.description} />
          <div className={styles.indicator}>
            <ProgressBar max={deck.users.length} value={currentIndex + 1} />
            <div className={styles.indicatorCards}>
              {deck.users.map((_, index) => (
                <IndicatorCard key={index} checked={index < currentIndex} current={index === currentIndex} />
              ))}
            </div>
            <p>Interrogez-vous sur chaque utilisateur extrême</p>
          </div>
          <CardText type='user' content={deck.users[currentIndex].description} />
        </div>
        <form className={styles.form}>
          <Textarea label={'Description du défaut d’inclusion'} />
          <Textarea label={'Description de la solution proposée'} />
          <Textarea label={'Comment la solution pourrait améliorer l\'expérience d\'usage pour d\'autres utilisateurs ?'} />
          <div className={styles.checkboxInputs}>
            <InputCheckboxes label={'Quels sont les autres utilisateurs extrêmes concernés par la fiche réponse ?'} />
          </div>
        </form>
        <div className={styles.containerButtons}>
          <Button startIcon={<IconArrowNarrowLeft />} variant='secondary' onClick={handlePrev} disabled={currentIndex === 0}>
            Précédente
          </Button>
          <Button endIcon={<IconArrowNarrowRight />} variant='primary' onClick={handleNext} disabled={currentIndex === deck.users.length - 1}>
            Suivante
          </Button>
        </div>
      </div>
      
      <div className={styles.deck}>      
        <button 
          onClick={() => setDeckOpen(true)} 
          className={styles.buttonDeck}
          style={{ display: isDeckOpen ? 'none' : 'block' }}
        > 
          Deck
        </button>
        {isDeckOpen && <Deck deck={deck} />}
      </div>
    </div>
  );
};
