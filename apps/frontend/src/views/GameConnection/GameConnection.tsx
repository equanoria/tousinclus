import { useEffect, useState } from 'react';
import { GameAPIService, GameInfo } from '../../services/GameApiService';
import { SocketIoService } from '../../services/SocketIoService';
import styles from './GameConnection.module.css';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';

export const GameConnection = () => {
  const [gameCode, setGameCode] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [team, setTeam] = useState('');
  const [isWaiting, setIsWaiting] = useState(false);
  const [gameInfo, setGameInfo] = useState<GameInfo | null>(null);

  // Function to join a game using the game code
  const handleJoinGame = async () => {
    if (!gameCode.trim()) {
      alert("Entrez un code.");
      return;
    }

    try {
      // Retrieve game information from the API
      const gameData = await GameAPIService.getGameInfos(gameCode);
      if (gameData) {
        setGameInfo(gameData);
        // Connect to the WebSocket server
        SocketIoService.connect();
        setIsConnected(true);
      } else {
        alert("Code de jeu invalide.");
      }
    } catch (error) {
      console.error("Connection error:", error);
    }
  };

  // Function to select a team and notify the server via WebSocket
  const handleChooseTeam = (selectedTeam: string) => {
    setTeam(selectedTeam);
    setIsWaiting(true); // Show the waiting message immediately
    SocketIoService.joinGame(gameCode, selectedTeam);
  };

  // Listen for team connection status updates via WebSocket
  useEffect(() => {
    SocketIoService.onTeamConnectionUpdated((data) => {
      if (data.gameCode === gameCode) {
        setGameInfo(data);
        // If both teams are connected, remove the waiting message
        if (data.isTeam1Connected && data.isTeam2Connected) {
          setIsWaiting(false);
        }
      }
    });

    // Disconnect the socket when the component is unmounted
    return () => {
      SocketIoService.disconnect();
    };
  }, [gameCode]);

  return (
    <div className={styles.pageConnection}>
      <h1>tous inclus</h1>
      {!isConnected ? (
        <div className={styles.connection}>
          <Input
            label="Enter the game code"
            type="text"
            value={gameCode}
            onChange={(e) => setGameCode(e.target.value)}
            placeholder="123456"
          />
          <Button className={styles.connectionBtn} onClick={handleJoinGame} variant="primary">
            Rejoindre la partie
          </Button>
        </div>
      ) : (
        <div className={styles.teamSelection}>
          {isWaiting ? (
            <p>Dans l'attente de l'autre équipe...</p>
          ) : (
            <>
              <div className={styles.teamButtons}>
                <Button onClick={() => handleChooseTeam('team1')} variant="primary">
                  Équipe 1
                </Button>
                <Button onClick={() => handleChooseTeam('team2')} variant="tertiary">
                  Équipe 2
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
