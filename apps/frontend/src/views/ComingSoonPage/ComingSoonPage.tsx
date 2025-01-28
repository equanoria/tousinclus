import styles from './ComingSoonPage.module.css';
import tousinclusLogo from '/tousinclus.svg';
import { Link } from '../../components/Link/Link';

const ComingSoonPage = () => {
  return (
    <>
      <section className={styles.hero}>
        <div>
          <div className={styles.headings}>
            <h1>Tous inclus <br />débarque <br />prochaînement</h1>
            <div className={styles.buttons}>
              <Link
                variant="button-secondary"
                className={styles.button}
                href="https://www.apf-francehandicap.org/"
                target="_blank"
              >
                apf-francehandicap.org
              </Link>
              <Link
                variant="button-primary"
                className={styles.button}
                href="https://techlab-handicap.org/le-techlab-accompagne-les-entreprises-dans-leur-demarche-dinnovation-inclusive/jeu-serieux-tous-inclus/"
                target="_blank"
              >
                techlab-handicap.org
              </Link>
            </div>
          </div>
          <a
            href="https://techlab-handicap.org/le-techlab-accompagne-les-entreprises-dans-leur-demarche-dinnovation-inclusive/jeu-serieux-tous-inclus/"
            target="_blank"
          >
            <figure className={styles.figure}>
              <figcaption>Équanoria présente</figcaption>
              <img src={tousinclusLogo} alt="Site web de la présentation du jeu Tous Inclus" />
            </figure>
          </a>
        </div>
      </section>
    </>
  );
};

export default ComingSoonPage;