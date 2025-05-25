import { useEffect, useState } from 'react';
import { useAppState } from '../../context/AppStateProvider';
import { gameReflectionService } from '../../services/game/game-reflection.service';
import type { IDirectusCardsGroup } from '@tousinclus/types';
import { directusService } from '../../services/directus/directus.service';
import { gameService } from '../../services/game/game.service';

export const GameReflection = () => {
  const [cardsGroup, setCardsGroup] = useState<IDirectusCardsGroup>();
  const [extremeUserCursor, setExtremeUserCursor] = useState<number>(0);
  const { titleManager } = useAppState();

  titleManager.set('Phase de réflexion');

  useEffect(() => {
    gameReflectionService.onGetAnswersResponse(fetchCardGroup)
  }, [])

  const fetchCardGroup = async () => {
    const group = await directusService.getCardsGroup(gameService.cardsGroupId);
    setCardsGroup(group);
    console.log(cardsGroup)
  };

  const getCard = () => {

  }
  
  return (
    <h1>Phase de réflexion</h1>
  )
}
