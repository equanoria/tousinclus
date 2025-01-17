import styles from './LandingPage.module.css';
import tousinclusLogo from '/tousinclus.svg';
import { Link } from '../../components/Link/Link';

const LandingPage = () => {
  return (
    <>
      <section className={styles.hero}>
        <div>
          <a
            href="https://techlab-handicap.org/le-techlab-accompagne-les-entreprises-dans-leur-demarche-dinnovation-inclusive/jeu-serieux-tous-inclus/" 
            target="_blank"
          >
            <img src={tousinclusLogo} className="logo" alt="Site web de la présentation du jeu Tous Inclus" />
          </a>
        </div>
        <div>
          <div>
            <h1>On est en chemin !</h1>
            <p>Le jeu sérieux Tous inclus débarque sur le web, très bientôt.</p>
          </div>
          <Link
            variant="button-outlined"
            className={styles.button}
            href="https://techlab-handicap.org/le-techlab-accompagne-les-entreprises-dans-leur-demarche-dinnovation-inclusive/jeu-serieux-tous-inclus/"
            target="_blank"
          >
            techlab-handicap.org
          </Link>
        </div>
      </section>
    </>
  );
};

export default LandingPage;