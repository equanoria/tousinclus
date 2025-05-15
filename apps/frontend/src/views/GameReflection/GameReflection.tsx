import { useState } from 'react';
import { Checkbox } from '../../components/Checkbox/Checkbox';
import { Input } from '../../components/Input/Input';
import { useAppState } from '../../context/AppStateProvider';
import type { IAnswerData } from '@tousinclus/types';
// import { reflectionService } from '../../services/ReflectionService';

const checkboxOptions = [
  { id: 12, label: 'Je suis réponse 1' },
  { id: 14, label: 'Je suis réponse 2' },
  { id: 54, label: 'Je suis réponse 3' },
  { id: 47, label: 'Je suis réponse 4' },
  { id: 89, label: 'Je suis réponse 5' },
];

export const GameReflection = () => {
  const { gameCode, team } = useAppState();

  const [answers, setAnswers] = useState<IAnswerData>({
    input1: '',
    input2: '',
    input3: '',
    inputCheckboxes: [],
  });

  const handleChange = (key: keyof IAnswerData, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCheckboxChange = (id: number, checked: boolean) => {
    setAnswers((prev) => ({
      ...prev,
      inputCheckboxes: checked
        ? [...prev.inputCheckboxes, id]
        : prev.inputCheckboxes.filter((item) => item !== id),
    }));
  };

  const handleSubmit = () => {
    if (!gameCode || !team) return;

    const payload = {
      code: gameCode,
      team,
      cardId: 1,
      answer: answers,
    };

    console.log('payload', payload);

    // reflectionService.sendReflection(payload);
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <Input
        label="Question 1"
        placeholder=""
        value={answers.input1}
        onChange={(e) => handleChange('input1', e.target.value)}
      />
      <Input
        label="Question 2"
        placeholder=""
        value={answers.input2}
        onChange={(e) => handleChange('input2', e.target.value)}
      />
      <Input
        label="Question 3"
        placeholder=""
        value={answers.input3}
        onChange={(e) => handleChange('input3', e.target.value)}
      />
      <div>
        <p>Pour quelles réponses ?</p>
        {checkboxOptions.map(({ id, label }) => (
          <Checkbox
            key={id}
            label={label}
            checked={answers.inputCheckboxes.includes(id)}
            onChange={(e) => handleCheckboxChange(id, e.target.checked)}
          />
        ))}
      </div>
      <input type="button" value="Submit" onClick={handleSubmit} />
    </form>
  );
};
