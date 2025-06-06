import { useEffect, useState } from 'react';
import { useAppState } from '../../context/AppStateProvider';
import { gameDebateService } from '../../services/game/game-debate.service';
import type { ETeam, IAnswer, IDirectusCardsGroup } from '@tousinclus/types';
import { Button } from '../../components/Button/Button';
import { directusService } from '../../services/directus/directus.service';
import { gameService } from '../../services/game/game.service';
import { Notification } from '../../components/Notification/Notification';

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
      const group = await directusService.getCardsGroup(gameService.cardsGroupId);
      setCardsGroup(group);
    };
    fetchCardGroup();

    gameDebateService
      .getVote()
      .onError((error) => {
        if (error === 'consensus')
        setNotification('Veuillez vous mettre d\'accord, merci. Cordialement, la direction');
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
    return cardsGroup.extreme_user?.find(user => user.cards_users_id.id === id);
  };
  
  return (
    <>
      <h1>Phase de débat</h1>
      {notification && (
        <Notification onClose={() => setNotification(null)}>
          {notification}
        </Notification>
      )}
      <div>
        {answers.length > 0 && (
          <fieldset>
            <legend>Choisissez une équipe à voter</legend>
            {answers.map((answer) => {
              const checkBoxes = answer.answer?.inputCheckboxes;
              return (
                <div key={answer.team} className="debate-answer">
                  <label>
                    <input
                      type="radio"
                      name="teamVote"
                      value={answer.team}
                      checked={vote === answer.team}
                      onChange={() => setVote(answer.team)}
                    />
                    <p>{answer.answer?.input1}</p>
                    <p>{answer.answer?.input2}</p>
                    <p>{answer.answer?.input3}</p>
                    {checkBoxes && checkBoxes?.length > 0 && (
                      <ul>
                        {checkBoxes.map((checkbox) => {
                          const extremeUser = getExtremeUser(checkbox);
                          if (!extremeUser) return;
                          return (
                            <li key={checkbox}>
                              {extremeUser.cards_users_id.translations[0].description}
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </label>
                </div>
              );
            })}
          </fieldset>
        )}

        <Button onClick={handleVote} disabled={!vote}>Valider mon vote</Button>
      </div>
    </>
  )
}
