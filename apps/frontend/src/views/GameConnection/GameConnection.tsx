import { useRef, useState } from 'react';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import { useAppState } from '../../context/AppStateProvider';
import { GameService } from '../../services/GameService';
import styles from './GameConnection.module.css';

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
  const { setCurrentStep } = useAppState();

  gameService.onJoiningResponse(({ code, team1, team2 }) => {
    setCode(code);
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
    if (status !== 'success') {
      // handle error
      return;
    }

    setConnectionState(ConnectionState.WAITING);

    setTimeout(() => {
      setCurrentStep(1);
    }, 2000);
  });

  // Check teams avails
  const handleJoining = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const code = formData.get('code') as string;

    if (code) {
      gameService.joining(code);
    } else {
      console.error('Code is undefined');
    }
  };

  // Join a game
  const handleJoinGame = (team: Team) => {
    gameService.joinGame(code, team);
  };

  return (
    <div className={styles.pageConnection}>
      <img
        src="/assets/asset-connection-1.svg"
        alt=""
        className={styles.asset1}
      />
      <img
        src="/assets/asset-connection-2.svg"
        alt=""
        className={styles.asset2}
      />
      <img
        src="/assets/logo-tous-inclus.svg"
        alt="logo tous inclus"
        className={styles.logoTS}
      />
      {(() => {
        switch (connectionState) {
          case ConnectionState.CODE:
            return (
              <form onSubmit={handleJoining} className={styles.connection}>
                <Input
                  name="code"
                  label="Entrez le code du jeu"
                  type="text"
                  placeholder="123456"
                  pattern="\d{6}"
                />
                <Button
                  className={styles.connectionBtn}
                  variant="primary"
                  type="submit"
                >
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
      <div className={styles.footer}>
        <img
          src="/assets/logo-equanoria.svg"
          alt="logo equanoria"
          className={styles.logoEquanoria}
        />
        <div className={styles.credits}>
          <a href="/">Mentions légales</a>
          <a href="https://techlab-handicap.org/" target="blank">
            À propos
          </a>
        </div>
      </div>
    </div>
  );
};
