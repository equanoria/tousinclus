import styles from './GameConnection.module.css';import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import { useState } from 'react';
import { GameConnectionService } from './GameConnection.service';
import { ETeam } from '@tousinclus/types';

enum ConnectionState {
  CODE = 'code',
  TEAM = 'team',
  WAITING = 'waiting',
}

const gameConnectionService = new GameConnectionService();

export const GameConnection = () => {
  const [connectionState, setConnectionState] = useState<ConnectionState>(ConnectionState.CODE);
  const [code, setCode] = useState<string>('');
  const [availableTeams, setAvailableTeams] = useState<ETeam[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  gameConnectionService.onJoiningResponse((data) => {
    console.log(data)
    const teams: ETeam[] = [];

    if (!data.team1?.isConnected) teams.push(ETeam.TEAM1);
    if (!data.team2?.isConnected) teams.push(ETeam.TEAM2);

    setAvailableTeams(teams);
    setConnectionState(ConnectionState.TEAM);
  });

  gameConnectionService.onWaitingResponse((data) => {
    const { status, errorCode } = data;

    if (status !== 'success' && errorCode) setErrorMessage(errorCode);
  })

  const handleJoining = () => {
    gameConnectionService.joining(code)
  }

  const handleJoinGame = (team: ETeam) => {
    handleJoining();
    gameConnectionService.joinGame(code, team)
  }

  return (
    <div className={styles.pageConnection}>
      <h1>tous inclus</h1>
      <p className="error">{errorMessage}</p>
      {(() => {
        switch (connectionState) {
          case ConnectionState.CODE:
            return (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleJoining();
                  }}
                  className={styles.connection}
                >
                <Input
                  name="code"
                  label="Entrez le code de la partie"
                  type="text"
                  placeholder="123456"
                  pattern="\d{6}"
                  value={code ?? ''}
                  onChange={(e) => setCode(e.target.value)}
                />
                <Button
                  className={styles.connectionBtn}
                  variant="primary"
                  type="submit"
                  disabled={!code}
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
                    disabled={!availableTeams.includes(ETeam.TEAM1)}
                    onClick={() => handleJoinGame(ETeam.TEAM1)}
                    variant="primary"
                  >
                    Équipe 1
                  </Button>
                  <Button
                    disabled={!availableTeams.includes(ETeam.TEAM2)}
                    onClick={() => handleJoinGame(ETeam.TEAM2)}
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
