import clsx from 'clsx';
import { Link } from '../../components/Link/Link';
import { useAppState } from '../../context/AppStateProvider';
import { Decoration } from '../../layouts/Decoration/Decoration';
import styles from './Contact.module.css';
import { IconMail } from '@tabler/icons-react';

export const Contact = () => {
  const { titleManager } = useAppState();
  titleManager.set('Contact');

  return (
    <Decoration>
      <section className={clsx(styles.contact, 'fillHeight')}>
        <hgroup>
          <h1>Contact</h1>
          <p>Pour plus d'informations</p>
        </hgroup>
        <nav>
          <section>
            <h2>L'équipe</h2>
            <Link
              variant="button-primary"
              href="mailto:equanoria@tousinclus.org"
              endIcon={<IconMail />}
            >
              equanoria@tousinclus.org
            </Link>
          </section>

          <section>
            <h2>Le TechLab</h2>
            <Link
              variant="button-primary"
              href="mailto:estelle.peyrard@tousinclus.org"
              endIcon={<IconMail />}
            >
              estelle.peyrard@tousinclus.org
            </Link>
            <Link variant="button-primary" href="https://techlab-handicap.org">
              techlab-handicap.org
            </Link>
          </section>
        </nav>
      </section>
    </Decoration>
  );
};

Contact.path = '/contact';