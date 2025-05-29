import { useCallback, useEffect, useState } from 'react';
import { useAppState } from '../../context/AppStateProvider';
import { gameReflectionService } from '../../services/game/game-reflection.service';
import type { IAnswerData, IDirectusCardsGroup } from '@tousinclus/types';
import { directusService } from '../../services/directus/directus.service';
import { gameService } from '../../services/game/game.service';
import { Button } from '../../components/Button/Button';
import { Checkbox } from '../../components/Checkbox/Checkbox';
import { Input } from '../../components/Input/Input';
import { Deck } from '../../components/Deck/Deck';
import styles from './GameReflection.module.css';
import { GameCard } from '../../components/GameCard/GameCard';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

const defaultAnswer = {
  input1: '',
  input2: '',
  input3: '',
  inputCheckboxes: [],
};

export const GameReflection = () => {
  const [cardsGroup, setCardsGroup] = useState<IDirectusCardsGroup>();
  const [extremeUserCursor, setExtremeUserCursor] = useState<number>(0);
  const [answerData, setAnswerData] = useState<IAnswerData>(defaultAnswer);
  const { titleManager } = useAppState();
  const [hasStarted, setHasStarted] = useState(false);

  titleManager.set('Phase de réflexion');

  useEffect(() => {
    const fetchCardGroup = async () => {
      const group = await directusService.getCardsGroup(
        gameService.cardsGroupId,
      );
      setCardsGroup(group);
    };

    gameReflectionService.onGetAnswersResponse(fetchCardGroup);
  }, []);

  const usageSituation = cardsGroup?.usage_situation;
  const extremeUserId =
    cardsGroup?.extreme_user[extremeUserCursor].cards_users_id.id;

  useEffect(() => {
    if (!extremeUserId) return;

    const answer = gameReflectionService.getAnswer(extremeUserId);
    if (answer?.answer) {
      setAnswerData(answer.answer);
    } else {
      setAnswerData(defaultAnswer);
    }
  }, [extremeUserId]);

  const updateCursor = (direction: 'next' | 'back') => {
    if (!cardsGroup) return;

    setExtremeUserCursor((prev) => {
      const length = cardsGroup.extreme_user.length;
      updateAnswer();

      if (direction === 'next') {
        return (prev + 1) % length;
      }

      return (prev - 1 + length) % length;
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setAnswerData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxesChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, checked } = event.target;
    const id = Number.parseInt(name);

    setAnswerData((prev) => ({
      ...prev,
      inputCheckboxes: checked
        ? [...prev.inputCheckboxes, id]
        : prev.inputCheckboxes.filter((itemId) => itemId !== id),
    }));
  };

  const updateAnswer = useCallback(() => {
    if (!extremeUserId) return;

    gameReflectionService.updateAnswer(extremeUserId, answerData);
  }, [extremeUserId, answerData]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    updateAnswer();
  }, [updateAnswer, answerData.inputCheckboxes]);

  return (
    <section className={styles.pageReflection}>
      <h1>Phase de réflexion</h1>
      <p>
        Trouvez des solutions pour chaque utilisateur face à la situation
        concernée
      </p>
      {!hasStarted ? (
        <>
          <Deck cardsGroup={cardsGroup} onStart={() => setHasStarted(true)} />
        </>
      ) : (
        <section className={styles.reflectionContainer}>
          <div className={styles.leftContainer}>
            <h2>Fiche solution</h2>

            <div className={styles.containerForm}>
              <h3>Description user</h3>
              <div className={styles.form}>
                <Input
                  label="1. Description du défaut d’inclusion."
                  placeholder="Bla bla bla..."
                  type="text"
                  name="input1"
                  value={answerData.input1}
                  onChange={handleInputChange}
                  onBlur={updateAnswer}
                />
                <Input
                  label="2. Description de la solution proposée."
                  placeholder="Bla bla bla..."
                  type="text"
                  name="input2"
                  value={answerData.input2}
                  onChange={handleInputChange}
                  onBlur={updateAnswer}
                />
                <Input
                  label="3. Comment la solution pourrait améliorer l’expérience d’usage pour d’autres utilisateurs ?"
                  placeholder="Bla bla bla..."
                  type="text"
                  name="input3"
                  value={answerData.input3}
                  onChange={handleInputChange}
                  onBlur={updateAnswer}
                />
                <fieldset>
                  <p>
                    Quels sont les autres utilisateurs extrêmes concernés par la
                    fiche réponse ?
                  </p>
                  {cardsGroup?.extreme_user
                    ?.filter((_, index) => index !== extremeUserCursor)
                    .map((user) => {
                      const id = user.cards_users_id.id;
                      const name =
                        user.cards_users_id.translations[0].description;
                      return (
                        <Checkbox
                          label={name}
                          name={id.toString()}
                          key={id}
                          checked={answerData.inputCheckboxes.includes(id)}
                          onChange={handleCheckboxesChange}
                        />
                      );
                    })}
                </fieldset>
              </div>
            </div>
          </div>
          <div className={styles.rightContainer}>
            <div className={styles.situationContainer}>
              <h3>Votre deck de cartes</h3>
              <p>
                Trouvez des solutions pour chaque utilisateur face à la
                situation concernée
              </p>
              <GameCard
                key="situation"
                type="situation"
                img={directusService.getAssetUrl(usageSituation?.image)}
                alt={
                  usageSituation?.context_translations?.[0]?.context ??
                  usageSituation?.description_translations?.[0]?.description ??
                  'Situation'
                }
                number={usageSituation.id}
              />
            </div>
            <div className={styles.usersContainer}>
              <div className={styles.userIdNavigation}>
                {cardsGroup?.extreme_user.map((user, index) => {
                  const id = user.cards_users_id.id;
                  return (
                    <button
                      type="button"
                      key={id}
                      className={`${styles.userCircle} ${index === extremeUserCursor ? styles.active : ''}`}
                      onClick={() => setExtremeUserCursor(index)}
                    >
                      {id}
                    </button>
                  );
                })}
              </div>
              {cardsGroup?.extreme_user
                ?.filter((_, index) => index !== extremeUserCursor)
                .map((user) => {
                  const id = user.cards_users_id.id;
                  const name = user.cards_users_id.translations[0].description;
                  const image = user.cards_users_id.image;
                  return (
                    <GameCard
                      key={id}
                      type="user"
                      img={directusService.getAssetUrl(image)}
                      alt={name}
                      number={id}
                    />
                  );
                })}
              <Button
                onClick={() => updateCursor('next')}
                variant="icon"
                endIcon={<IconChevronRight />}
                className={styles.arrowRight}
              />
              <Button
                onClick={() => updateCursor('back')}
                variant="icon"
                endIcon={<IconChevronLeft />}
                className={styles.arrowLeft}
              />
            </div>
          </div>
          <img
            src="/src/assets/images/asset_4.svg"
            alt=""
            className={styles.asset_left}
          />
          <img
            src="/src/assets/images/asset_5.svg"
            alt=""
            className={styles.asset_right}
          />
        </section>
      )}
    </section>
  );
};
