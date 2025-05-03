import { IconArrowNarrowLeft, IconArrowNarrowRight } from '@tabler/icons-react';
import { useState } from 'react';
import { Button } from '../../components/Button/Button';
import { CardAnswers } from '../../components/CardAnswers/CardAnswers';
import { CardText } from '../../components/CardText/CardText';
import { IndicatorCard } from '../../components/IndicatorCard/IndicatorCard';
import { ProgressBar } from '../../components/ProgressBar/ProgressBar';
import styles from './GameDebate.module.css';

export const GameDebate = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const answers = [
    {
      deckId: 'ID_DECK',
      data: {
        input1: 'blabla',
        input2: 'blabla',
        input3: 'blabla',
        input4: 'blabla',
      },
    },
    {
      deckId: 'ID_DECK',
      data: {
        input1: 'blabla2',
        input2: 'blabla2',
        input3: 'blabla2',
        input4: 'blabla2',
      },
    },
    {
      deckId: 'ID_DECK',
      data: {
        input1: 'blabla3',
        input2: 'blabla3',
        input3: 'blabla3',
        input4: 'blabla3',
      },
    },
  ];

  const handleNext = () => {
    if (currentIndex < answers.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className={styles.pageDebate}>
      <img src="/assets/asset-bg.svg" alt="" className={styles.asset} />
      <div className={styles.containerTop}>
        <CardText
          type="situation"
          content="Vérifier que les aménagements spéciaux éventuellement prévus pour certains utilisateurs ne créent pas une ségrégation."
        />
        <div className={styles.indicator}>
          <ProgressBar max={answers.length} value={currentIndex + 1} />
          <div className={styles.indicatorCards}>
            {answers.map((deck, index) => (
              <IndicatorCard
                key={deck.deckId}
                checked={index < currentIndex}
                current={index === currentIndex}
              />
            ))}
          </div>
          <p>Interrogez-vous sur chaque utilisateur extrême</p>
        </div>
        <CardText
          type="user"
          content="Vérifier que les aménagements spéciaux éventuellement prévus pour certains utilisateurs ne créent pas une ségrégation."
        />
      </div>

      <form className={styles.form}>
        <CardAnswers team={'team1'} data={answers[currentIndex].data} />
        <CardAnswers team={'team2'} data={answers[currentIndex].data} />
      </form>

      <div className={styles.containerButtons}>
        <Button
          startIcon={<IconArrowNarrowLeft />}
          variant="secondary"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          Précédente
        </Button>
        <Button
          endIcon={<IconArrowNarrowRight />}
          variant="primary"
          onClick={handleNext}
          disabled={currentIndex === answers.length - 1}
        >
          Suivante
        </Button>
      </div>
    </div>
  );
};
