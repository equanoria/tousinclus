import { useEffect } from 'react';
import { useAppState } from '../../context/AppStateProvider';
import { gameDebateService } from '../../services/game/game-debate.service';

export const GameDebate = () => {
  const { titleManager } = useAppState();

  titleManager.set('Phase de débat');

  useEffect(() => {
    gameDebateService
    .getVote()
    .onGetVoteResponse((test) => {
      console.log('Vote received:', test);
    });
  }, []);
  
  return (
    <>
      <h1>Phase de débat</h1>
    </>
  )
}
