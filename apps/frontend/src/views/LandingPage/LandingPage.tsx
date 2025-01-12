import classes from './LandingPage.module.css';
import tousinclusLogo from '/tousinclus.svg';
import Button from '../../components/Button/Button'

const LandingPage = () => {
  return (
    <>
      <section className={classes.hero}>
        <div>
          <a
            href="https://techlab-handicap.org/le-techlab-accompagne-les-entreprises-dans-leur-demarche-dinnovation-inclusive/jeu-serieux-tous-inclus/" 
            target="_blank"
          >
            <img src={tousinclusLogo} className="logo" alt="Site web de la présentation du jeu Tous Inclus" />
          </a>
        </div>
        <h1>On est en chemin !</h1>
        <p>Le jeu sérieux Tous inclus débarque sur le web, très bientôt.</p>
        <Button type="link" variant="outlined" target="_blank" content="Voir plus de détails sur le jeu" href="https://techlab-handicap.org/le-techlab-accompagne-les-entreprises-dans-leur-demarche-dinnovation-inclusive/jeu-serieux-tous-inclus/" />
      </section>
    </>
  );
};

export default LandingPage;