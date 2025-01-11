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
        <h1>Bienvenue sur la LandingPage !</h1>
        <Button type="link" content="Voir plus de détails sur le jeu" />
      </section>
    </>
  );
};

export default LandingPage;