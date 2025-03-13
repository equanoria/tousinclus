import { Button } from '../../components/Button/Button';
import styles from './GameResults.module.css';
import clsx from 'clsx';

interface GameResultsProps {
  team: 'team1' | 'team2';
}

export const GameResults: React.FC<GameResultsProps> = ({ team }) => {
  const teamName = team === 'team1' ? 'Équipe 1' : 'Équipe 2'; 
  const score = 4
  return (
    <div className={styles.pageResults}>
      <img src="/assets/asset-bg-results.svg" alt="" className={styles.bgAsset} />
      <div className={styles.content}>
        <div className={styles.headingsContainer}>
            <h1 className="titleHero">Bravo à vous!</h1>
            <h2 className="titlePage">
            <span className={styles.winner}>{teamName}</span> est l’équipe gagnante.
            </h2>
        </div>
        <img src="/assets/asset-winner.svg" alt="" className={styles.winnerAsset} />
        <div className={styles.score}>
           <div className={clsx(styles.scoreContainer, styles.scoreTeam1)}>
                <div className={clsx(styles.team, styles.team1, 'heading heading-s')}>Équipe 1</div>
                <div className={styles.scoreDetails}>
                    <div>
                        <img src="/assets/asset-stars.png" alt="" />
                        <p className='heading heading-s'>Score :</p>
                    </div>
                    <p className='heading heading-s'>{score} points</p>
                </div>
           </div>
            <p className='titleHero'>VS</p>
            <div className={clsx(styles.scoreContainer, styles.scoreTeam1)}>
                <div className={clsx(styles.team, styles.team2, 'heading heading-s')}>Équipe 2</div>
                <div className={styles.scoreDetails}>
                    <div>
                        <img src="/assets/asset-stars.png" alt="" />
                        <p className='heading heading-s'>Score :</p>
                    </div>
                    <p className='heading heading-s'>{score} points</p>
                </div>
            </div>
           </div>
           <div className={styles.buttonsContainer}>
                <Button variant='secondary'>
                    Quitter
                </Button>
                <Button variant='primary'>
                    Rejouer
                </Button>
            </div>
      </div>
    </div>
  );
};
