import { useRef, useState } from 'react';
import { GameService } from '../../services/GameService';
import styles from './GameConnection.module.css';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import { useAppState } from '../../context/AppStateProvider';
import { GameReflection } from '../GameReflection/GameReflection';

enum ConnectionState {
  CODE = 'code',
  TEAM = 'team',
  WAITING = 'waiting',
}

enum Team {
  TEAM1 = 'team1',
  TEAM2 = 'team2',
}

export const GameConnection = () => {
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    ConnectionState.CODE,
  );
  const [code, setCode] = useState<string>('');
  const teamsAvailability = useRef<Team[]>([]);
  const gameService = new GameService();
  const { setCurrentView } = useAppState();

  gameService.onJoiningResponse(({ code, team1, team2 }) => {
    setCode(code);
    // console.log('code onJoiningResponse', code);
    if (!team1.isConnected) teamsAvailability.current.push(Team.TEAM1);
    if (!team2.isConnected) teamsAvailability.current.push(Team.TEAM2);

    if (teamsAvailability.current.length === 2) {
      setConnectionState(ConnectionState.CODE);
      // handle error
      return;
    }

    setConnectionState(ConnectionState.TEAM);
  });

  gameService.waitingResponse(({ status }) => {
    // console.log('status waitingResponse', status);
    if (status !== 'success') {
      // handle error
      return;
    }

    setConnectionState(ConnectionState.WAITING);
  });

  gameService.readyGame(({ status }) => {
    // console.log('status readyGame', status);
    if (status !== 'reflection') {
      // handle error
      return;
    }

    setCurrentView(<GameReflection />);
  });

  // Check teams avails
  const handleJoining = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const code = formData.get('code') as string;
    // console.log('code handleJoining', code);
    gameService.joining(code)
  };

  // Join a game
  const handleJoinGame = (team: Team) => {
    // console.log('handleJoinGame', { code, team });
    gameService.joinGame({ code, team });
  }

  return (
    <div className={styles.pageConnection}>
      <h1>tous inclus</h1>
      {(() => {
        switch (connectionState) {
          case ConnectionState.CODE:
            return (
              <form onSubmit={handleJoining} className={styles.connection}>
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
            );
          case ConnectionState.TEAM:
            return (
              <div className={styles.teamSelection}>
                <div className={styles.teamButtons}>
                  <Button
                    disabled={!teamsAvailability.current.includes(Team.TEAM1)}
                    onClick={() => handleJoinGame(Team.TEAM1)}
                    variant="primary"
                  >
                    Équipe 1
                  </Button>
                  <Button
                    disabled={!teamsAvailability.current.includes(Team.TEAM2)}
                    onClick={() => handleJoinGame(Team.TEAM2)}
                    variant="tertiary"
                  >
                    Équipe 2
                  </Button>
                </div>
              </div>
            );
          case ConnectionState.WAITING:
            return (
              <div className={styles.teamSelection}>
                <p>Dans l'attente de l'autre équipe...</p>
              </div>
            );
          default:
            return null;
        }
      })()}
    </div>
  );
};
