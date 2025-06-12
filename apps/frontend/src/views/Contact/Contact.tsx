import { Link } from '../../components/Link/Link';
import { useAppState } from '../../context/AppStateProvider';
import { Decoration } from '../../layouts/Decoration/Decoration';
import styles from './Contact.module.css';

export const Contact = () => {
  const { titleManager } = useAppState();
  titleManager.set('Contact');

  return (
    <Decoration>
      <section className={styles.contact}>
        <h1>Contact</h1>
        <nav>
          <Link
            variant="button-primary"
            href="mailto:equanoria@tousinclus.org"
          >
            equanoria@tousinclus.org
          </Link>
          <Link
            variant="button-primary"
            href="mailto:estelle.peyrard@tousinclus.org"
          >
            estelle.peyrard@tousinclus.org
          </Link>
          <Link variant="button-primary" href="https://techlab-handicap.org">
            techlab-handicap.org{' '}
          </Link>
        </nav>
      </section>
    </Decoration>
  );
};

Contact.path = '/contact';