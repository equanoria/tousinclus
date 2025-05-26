import { useCallback, useEffect, useState } from 'react';
import { useAppState } from '../../context/AppStateProvider';
import { gameReflectionService } from '../../services/game/game-reflection.service';
import type { IAnswerData, IDirectusCardsGroup } from '@tousinclus/types';
import { directusService } from '../../services/directus/directus.service';
import { gameService } from '../../services/game/game.service';
import { Button } from '../../components/Button/Button';
import { Checkbox } from '../../components/Checkbox/Checkbox';
import { Input } from '../../components/Input/Input';

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

  titleManager.set('Phase de réflexion');

  useEffect(() => {
    const fetchCardGroup = async () => {
      const group = await directusService.getCardsGroup(gameService.cardsGroupId);
      setCardsGroup(group);
    };

    gameReflectionService.onGetAnswersResponse(fetchCardGroup)
  }, [])

  const extremeUserId = cardsGroup?.extreme_user[extremeUserCursor].cards_users_id.id;

  useEffect(() => {
    if (!extremeUserId) return;

    const answer = gameReflectionService.getAnswer(extremeUserId)
    if (answer?.answer) {
      setAnswerData(answer.answer);
    } else {
      setAnswerData(defaultAnswer);
    }
  }, [extremeUserId])

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
  }

  const handleCheckboxesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    const id = Number.parseInt(name);

    setAnswerData((prev) => ({
      ...prev,
      inputCheckboxes: checked
        ? [...prev.inputCheckboxes, id]
        : prev.inputCheckboxes.filter((itemId) => itemId !== id),
    }));
  }

  const updateAnswer = useCallback(() => {
    if (!extremeUserId) return;

    gameReflectionService.updateAnswer(
      extremeUserId,
      answerData,
    );
  }, [extremeUserId, answerData]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    updateAnswer();
  }, [updateAnswer, answerData.inputCheckboxes]);
  
  return (
    <>
      <h1>Phase de réflexion</h1>
      <Button onClick={() => updateCursor('next')}>Next</Button>
      <Button onClick={() => updateCursor('back')}>Back</Button>

      <Input label="Question 1" placeholder="Bla bla bla..." type="text" name="input1" value={answerData.input1} onChange={handleInputChange} onBlur={updateAnswer} />
      <Input label="Question 2" placeholder="Bla bla bla..." type="text" name="input2" value={answerData.input2} onChange={handleInputChange} onBlur={updateAnswer} />
      <Input label="Question 3" placeholder="Bla bla bla..." type="text" name="input3" value={answerData.input3} onChange={handleInputChange} onBlur={updateAnswer} />
      
      <fieldset>
        {cardsGroup?.extreme_user
          ?.filter((_, index) => index !== extremeUserCursor)
          .map((user) => {
            const id = user.cards_users_id.id;
            const name = user.cards_users_id.translations[0].description;
            return (
              <Checkbox label={name} name={id.toString()} key={id} checked={answerData.inputCheckboxes.includes(id)} onChange={handleCheckboxesChange} />
            );
          })}
      </fieldset>
    </>
  )
}
