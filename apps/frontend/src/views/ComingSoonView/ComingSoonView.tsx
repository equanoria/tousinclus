import styles from './ComingSoonView.module.css';
import { Link } from '../../components/Link/Link';

export const ComingSoonView = () => {
  return (
    <>
      <section className={styles.hero}>
        <div>
          <div className={styles.headings}>
            <h1>Tous inclus arrive <br />très prochaînement…</h1>
            <div className={styles.buttons}>
              <Link
                variant="button-secondary"
                className={styles.button}
                href="https://www.apf-francehandicap.org/"
                target="_blank"
              >
                APF France handicap
              </Link>
              <Link
                variant="button-primary"
                className={styles.button}
                href="https://techlab-handicap.org/le-techlab-accompagne-les-entreprises-dans-leur-demarche-dinnovation-inclusive/jeu-serieux-tous-inclus/"
                target="_blank"
              >
                TechLab
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};