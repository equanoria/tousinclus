import { Decoration } from '../../layouts/Decoration/Decoration';
import styles from './Legal.module.css';

export const Legal = () => {
  return (
    <Decoration>
      <section className={styles.legal}>
        <div className={styles.legalContent}>
          <h1 className={styles.titlePage}>Mentions légales</h1>
          <p>coucou je suis les mentions légales</p>
        </div>
      </section>
    </Decoration>
  );
};

Legal.path = '/legal';