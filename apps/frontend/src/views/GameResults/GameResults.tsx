import styles from './GameResults.module.css';

export const GameResults = () => {
  return (
    <section className={styles.gameResults}>
      <img src="src/assets/images/bg-asset-results.svg" alt="" className={styles.backgroundAsset} />
      <h1>Bravo à tous</h1>
    </section>
  );
};
