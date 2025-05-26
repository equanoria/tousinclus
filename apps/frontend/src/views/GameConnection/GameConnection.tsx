import styles from './GameConnection.module.css';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import { useEffect, useState } from 'react';
import { ETeam, type IGame } from '@tousinclus/types';
import { gameService } from '../../services/game/game.service';
import { useAppState } from '../../context/AppStateProvider';
import type { ISocketResponse } from '../../types/ISocketResponse';
import { sessionStorageManager } from '@tousinclus/managers';
import { Link } from '../../components/Link/Link';

enum ConnectionState {
  CODE = 'code',
  TEAM = 'team',
  WAITING = 'waiting',
}

const VALIDATION_PATTERN = /^\d{6}$/;

export const GameConnection = () => {
  const { titleManager } = useAppState();
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    ConnectionState.CODE,
  );
  const [code, setCode] = useState<string>('');
  const [availableTeams, setAvailableTeams] = useState<ETeam[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    gameService
      .onJoiningResponse(onJoiningResponse)
      .onWaitingResponse(onWaitingResponse);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const lastGameCode = sessionStorageManager.getItem<string>('GAME_CODE');
    if (lastGameCode) setCode(lastGameCode);
  }, []);

  const onJoiningResponse = (payload: ISocketResponse<IGame>) => {
    const { status, message, data } = payload;

    if (status !== 'success') {
      setErrorMessage(message);
      return;
    }

    joining(data);
  };

  const onWaitingResponse = (payload: ISocketResponse<IGame>) => {
    const { status, message, data } = payload;

    if (status !== 'success') {
      setErrorMessage(message);
      return;
    }

    sessionStorageManager.setItem('GAME_CODE', data.code);
    setConnectionState(ConnectionState.WAITING);
  };

  const joining = (game: IGame) => {
    const teams: ETeam[] = [];

    if (!game.team1?.isConnected) teams.push(ETeam.TEAM1);
    if (!game.team2?.isConnected) teams.push(ETeam.TEAM2);

    setAvailableTeams(teams);
    setConnectionState(ConnectionState.TEAM);
  };

  const handleJoining = () => {
    setErrorMessage('');
    gameService.joining(code);
  };

  const handleJoinGame = (team: ETeam) => {
    handleJoining();
    gameService.joinGame(code, team);
  };

  return (
    <div className={styles.pageConnection}>
      <img
        src="/src/assets/images/asset_1.svg"
        alt=""
        className={styles.asset_top}
      />
      <img
        src="/src/assets/images/logo-ts.svg"
        alt=""
      />
      <p className="error">{errorMessage}</p>
      {(() => {
        switch (connectionState) {
          case ConnectionState.TEAM:
            titleManager.set('Connexion à une partie');
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
            titleManager.set("En attente de l'autre équipe...");
            return (
              <div className={styles.teamSelection}>
                <p>Dans l'attente de l'autre équipe...</p>
              </div>
            );
          default:
            titleManager.reset();
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
                  pattern={VALIDATION_PATTERN.source}
                  value={code ?? ''}
                  onChange={(e) => setCode(e.target.value)}
                />
                <Button
                  className={styles.connectionBtn}
                  variant="primary"
                  type="submit"
                  disabled={!VALIDATION_PATTERN.test(code)}
                >
                  Rejoindre la partie
                </Button>
              </form>
            );
        }
      })()}
      <img
        src="/src/assets/images/asset_2.svg"
        alt=""
        className={styles.asset_bottom}
      />
      <img src="src/assets/images/logo-eq.svg" alt="" />
      <div className={styles.footer}>
        <Link href="/mention_legal">Mention Légales</Link>
        <Link href="/a_propos">À propos</Link>
      </div>
    </div>
  );
};
