import type { ETeam, IAnswer, IDirectusCardsGroup } from '@tousinclus/types';
import { useEffect, useState } from 'react';
import { Button } from '../../components/Button/Button';
import { Notification } from '../../components/Notification/Notification';
import { VotingButton } from '../../components/VotingButton/VotingButton';
import { useAppState } from '../../context/AppStateProvider';
import { directusService } from '../../services/directus/directus.service';
import { gameDebateService } from '../../services/game/game-debate.service';
import { gameService } from '../../services/game/game.service';
import styles from './GameDebate.module.css';

export const GameDebate = () => {
  const [answers, setAnswers] = useState<IAnswer[]>([]);
  const [cardId, setCardId] = useState<number>();
  const [vote, setVote] = useState<ETeam>();
  const [cardsGroup, setCardsGroup] = useState<IDirectusCardsGroup>();
  const [notification, setNotification] = useState<string | null>(null);
  const { titleManager } = useAppState();

  titleManager.set('Phase de débat');

  useEffect(() => {
    const fetchCardGroup = async () => {
      const group = await directusService.getCardsGroup(
        gameService.cardsGroupId,
      );
      setCardsGroup(group);
    };
    fetchCardGroup();

    gameDebateService
      .getVote()
      .onError((error) => {
        if (error === 'consensus')
          setNotification(
            'Vous et l\'équipe adverse avez voté pour une solution différente, vous devez choisir la même fiche.',
          );
      })
      .onNextVote((payload) => {
        const { answers, nextCardId } = payload.data;
        setAnswers(answers);
        setCardId(nextCardId);
        setVote(undefined);
      });
  }, []);

  const handleVote = () => {
    if (!vote || !cardId) return;
    gameDebateService.updateVote(cardId, vote);
  };

  const getExtremeUser = (id: number) => {
    if (!cardsGroup) return;
    return cardsGroup.extreme_user?.find(
      (user) => user.cards_users_id.id === id,
    );
  };

  return (
    <section className={styles.gameDebate}>
      <h1 className="titlePage">Phase de débat</h1>
      {notification && (
        <Notification onClose={() => setNotification(null)}>
          {notification}
        </Notification>
      )}
      <p className={`${styles.descriptionDebate} heading`}>
        Débattez des solutions que vous avez trouvées pour chaque utilisateur
        extrême et votez pour l’une des deux fiches.
      </p>
      <div className={styles.debateContent}>
        {answers.length > 0 && (
          <fieldset>
            {answers.map((answer) => {
              const checkBoxes = answer.answer?.inputCheckboxes;
              return (
                <div key={answer.team} className={styles.formAnswers}>
                  <div className={styles.answerCard}>
                    <h2 className="headerSolution titlePage">Fiche solution</h2>
                    <div className={styles.answerContainer}>
                      <label htmlFor="teamVote">
                        <VotingButton
                          name="teamVote"
                          value={answer.team as ETeam}
                          checked={vote === answer.team}
                          onChange={() => setVote(answer.team)}
                          className={styles.votingBtn}
                        />
                        <div className={styles.answerContent}>
                          <div className={styles.answerSubcontent}>
                            <p className="body-base-2">
                              1. Description du défaut d’inclusion
                            </p>
                            <p>{answer.answer?.input1}</p>
                          </div>
                          <div className={styles.answerSubcontent}>
                            <p className="body-base-2">
                              2. Description de la solution proposée
                            </p>
                            <p>{answer.answer?.input2}</p>
                          </div>
                          <div className={styles.answerSubcontent}>
                            <p className="body-base-2">
                              3. Comment la solution pourrait améliorer
                              l’expérience d’usage pour d’autres utilisateurs ?
                            </p>
                            <p>{answer.answer?.input3}</p>
                          </div>
                          {checkBoxes && checkBoxes?.length > 0 && (
                            <div className={styles.answerSubcontent}>
                              <p className="body-base-2">
                                4. Autres extrêmes utilisateurs impliquées
                              </p>
                              <ul className={styles.extremeUsersList}>
                                {checkBoxes.map((checkbox) => {
                                  const extremeUser = getExtremeUser(checkbox);
                                  if (!extremeUser) return;
                                  return (
                                    <li key={checkbox}>
                                      {
                                        extremeUser.cards_users_id
                                          .translations[0].description
                                      }
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              );
            })}
          </fieldset>
        )}
        <Button
          onClick={handleVote}
          disabled={!vote}
          className={styles.confirmButton}
        >
          Valider mon vote
        </Button>
      </div>
    </section>
  );
};
