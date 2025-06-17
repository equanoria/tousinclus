import { Decoration } from '../../layouts/Decoration/Decoration';
import styles from './Legal.module.css';

export const Legal = () => {
  return (
    <Decoration>
      <section className={styles.legal}>
        <h1>Mentions légales</h1>

        <section>
          <h2>Éditeurs du site tousinclus.org</h2>
          <p>
            <strong>APF France handicap (Siège du TechLab)</strong>
            <br />
            17, boulevard Auguste Blanqui – 75013 Paris
            <br />
            Standard : 01 40 78 69 00
          </p>

          <p>
            Association reconnue d’utilité publique (ARUP)
            <br />
            Numéro RNA : W751019820
            <br />
            Numéro de TVA intracommunautaire : FR27775688732
          </p>

          <p>
            L’équipe composée d’Anaïs MICHEL, Antoine ATALI, Cécile PHAN-NGUYEN,
            Dan PHAN-NGUYEN, Diyana BALIT, Léa VILLAIN, Léo PLANUS, Patrick
            FAURE, ci-après désignée “Équanoria”.
          </p>

          <p>
            <strong>Directrice de la publication du site :</strong> Estelle
            Peyrard
          </p>
        </section>

        <section>
          <h2>Hébergeur du site</h2>
          <p>
            <strong>OVH</strong>
            <br />
            RCS Roubaix – Tourcoing 424 761 419 00045
            <br />
            Code APE : 6202A
            <br />
            N° TVA : FR 22 424 761 419
            <br />
            Siège social : 2 rue Kellermann - 59100 Roubaix - France
          </p>
        </section>

        <section>
          <h2>Propriété intellectuelle</h2>
          <p>
            Les textes, graphismes, logos, vidéos, icônes et sons du site
            tousinclus.org sont protégés par le droit de la propriété
            intellectuelle et sont la propriété d’Équanoria.
          </p>

          <p>
            Cependant, le code source est mis à disposition sous licence MIT.
            Cela signifie qu'il peut être librement utilisé, modifié et
            redistribué, à condition de conserver la mention de copyright et les
            conditions de la licence dans toute copie ou version dérivée.
          </p>

          <p>
            Les illustrations des cartes présentes sur le site tousinclus.org
            sont la propriété exclusive de l'École de design Nantes Atlantique
            et de l'École polytechnique. Elles sont mises à disposition pour une
            utilisation sur le site sans autorisation de modification. Toute
            reproduction, altération ou diffusion de ces illustrations sans le
            consentement explicite des deux écoles est strictement interdite.
          </p>
        </section>

        <section>
          <h2>Données personnelles</h2>
          <p>
            En France, les données personnelles sont notamment protégées par :
          </p>
          <ul>
            <li>la loi n° 78-87 du 6 janvier 1978,</li>
            <li>la loi n° 2004-801 du 6 août 2004,</li>
            <li>l’article L. 226-13 du Code pénal,</li>
            <li>la Directive Européenne du 24 octobre 1995.</li>
          </ul>

          <p>
            Le site tousinclus.org ne collecte aucune donnée personnelle
            identifiable sur ses utilisateurs. Les réponses fournies dans le
            cadre du jeu sont enregistrées de manière anonyme et utilisées
            uniquement pour des analyses statistiques.
          </p>

          <p>
            Conformément aux dispositions des articles 38 et suivants de la loi
            78-17 du 6 janvier 1978 relative à l’informatique, aux fichiers et
            aux libertés, tout utilisateur dispose d’un droit d’accès, de
            rectification et d’opposition aux données personnelles le
            concernant, en effectuant sa demande écrite et signée, accompagnée
            d’une copie du titre d’identité avec signature du titulaire de la
            pièce, en précisant l’adresse à laquelle la réponse doit être
            envoyée.
          </p>

          <p>
            Le site n’est pas déclaré à la CNIL car il ne recueille pas
            d’informations personnelles à risque.
          </p>
        </section>

        <section>
          <h2>Droits applicables et attribution de juridiction</h2>
          <p>
            Tout litige en relation avec l’utilisation du site est soumis au
            droit français. Il est fait attribution exclusive de juridiction aux
            tribunaux compétents de Paris.
          </p>
        </section>

        <section>
          <h2>Principales lois concernées</h2>
          <ul>
            <li>
              Loi n° 78-17 du 6 janvier 1978, notamment modifiée par la loi n°
              2004-801 du 6 août 2004 relative à l’informatique, aux fichiers et
              aux libertés.
            </li>
            <li>
              Loi n° 2004-575 du 21 juin 2004 pour la confiance dans l’économie
              numérique.
            </li>
          </ul>
        </section>
      </section>
    </Decoration>
  );
};

Legal.path = '/legal';
