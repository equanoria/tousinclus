import { useEffect, useState } from 'react';
import { GameService } from '../../services/GameService';
import styles from './GameConnection.module.css';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';

export const GameConnection = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [gameCode, setGameCode] = useState('');
  const [isWaiting, setIsWaiting] = useState(false);

  const gameService = new GameService();

  // Function to join a game using the game code
  const handleJoinGame = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    const form = event.currentTarget;
    const formData = new FormData(form);
    const code = formData.get('code');

    gameService.joinGame(code)
  };

  return (
    <div className={styles.pageConnection}>
      <h1>tous inclus</h1>
      {!isConnected ? (
        <form onSubmit={handleJoinGame} className={styles.connection}>
          <Input
            name="code"
            label="Enter the game code"
            type="text"
            placeholder="123456"
            pattern="\d{6}"
          />
          <Button className={styles.connectionBtn} variant="primary" type="submit">
            Rejoindre la partie
          </Button>
        </form>
      ) : (
        <div className={styles.teamSelection}>
          {isWaiting ? (
            <p>Dans l'attente de l'autre équipe...</p>
          ) : (
            <div className={styles.teamButtons}>
              <Button onClick={() => handleChooseTeam('team1')} variant="primary">
                Équipe 1
              </Button>
              <Button onClick={() => handleChooseTeam('team2')} variant="tertiary">
                Équipe 2
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
