import { Button } from '../../components/Button/Button';
import { Team } from '../../components/Team/Team';
import styles from './GameResults.module.css';

export const GameResults = () => {
  return (
    <section className={styles.gameResults}>
      <div className={styles.content}>
        <h1 className={styles.title_hero}>Bravo à tous</h1>
        <img src="src/assets/images/character-winner.svg" alt="" />
        <div className={styles.resultsContainer}>
          <Team team="team1" winner={false} score={2} label="Équipe 1" />
          <div className={`${styles.vs} ${styles.title_hero}`}>VS</div>
          <Team team="team2" winner={true} score={2} label="Équipe 2" />
        </div>
        <div className={styles.actions}>
          <Button variant="secondary">Quitter</Button>
          <Button>Rejouer</Button>
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
