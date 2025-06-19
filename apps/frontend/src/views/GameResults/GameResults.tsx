import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import characterWinner from 'src/assets/images/character-winner.svg';
import { Button } from '../../components/Button/Button';
import { Link } from '../../components/Link/Link';
import { Team } from '../../components/Team/Team';
import { useAppState } from '../../context/AppStateProvider';
import { gameResultService } from '../../services/game/game-result.service';
import type { TResult } from '../../services/game/types/TResults';
import styles from './GameResults.module.css';

export const GameResults = () => {
  const [scores, setScores] = useState<TResult>({
    team1: 0,
    team2: 0,
  });

  const { titleManager } = useAppState();

  const navigate = useNavigate();

  titleManager.set('Résultats du jeu');

  useEffect(() => {
    gameResultService.getResult().onGetResultResponse((response) => {
      if (!response.data) return;
      const { data } = response;

      if (
        typeof data === 'object' &&
        data !== null &&
        'team1' in data &&
        'team2' in data &&
        !('cardsGroupId' in data)
      ) {
        setScores(data as TResult);
      }
    });
  }, []);

  const handleRestart = () => {
    gameResultService.restartGame();
    navigate('/');
  };

  return (
    <section className={styles.gameResults}>
      <div className={styles.content}>
        <h1 className={styles.title_hero}>Bravo à tous</h1>
        <img src={characterWinner} alt="" />
        <div className={styles.resultsContainer}>
          <Team
            team="team1"
            winner={false}
            score={scores.team1}
            label="Équipe 1"
          />
          <div className={clsx(styles.vs, styles.title_hero)}>VS</div>
          <Team
            team="team2"
            winner={true}
            score={scores.team2}
            label="Équipe 2"
          />
        </div>
        <div className={styles.actions}>
          <Link variant="button-secondary" href="/">
            Quitter
          </Link>
          <Button onClick={() => handleRestart()}>Rejouer</Button>
        </div>
      </div>
      <img
        src="src/assets/images/bg-results-asset-1.svg"
        alt=""
        className={styles.asset_topLeft}
      />
      <img
        src="src/assets/images/bg-results-asset-2.svg"
        alt=""
        className={styles.asset_topRight}
      />
      <img
        src="src/assets/images/bg-results-asset-3.svg"
        alt=""
        className={styles.asset_bottomLeft}
      />
      <img
        src="src/assets/images/bg-results-asset-4.svg"
        alt=""
        className={styles.asset_bottomRight}
      />
    </section>
  );
};
