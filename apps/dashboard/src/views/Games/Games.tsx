import type { IGame } from '@tousinclus/types';
import { Button } from 'antd';
import { useEffect, useState } from 'react';
import { backendService } from '../../services/backend/backend.service';

export const Games = () => {
  const [games, setGames] = useState<IGame[]>([]);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    const games = await backendService.getAllGames().catch((error) => {
      return [];
    });
    setGames(games);
  };

  const handleDeleteGame = async (code: string) => {
    backendService.deleteGame(code);
    fetchGames();
  };

  return (
    <section>
      <ul>
        {games.length > 0 &&
          games.map((game) => (
            <li key={`${game.code}-${game.createdAt}`}>
              <h3>{game.code}</h3>
              <p>{game.status}</p>
              <Button
                type="primary"
                danger
                onClick={() => handleDeleteGame(game.code)}
              >
                Supprimer
              </Button>
            </li>
          ))}

        {games.length === 0 && (
          <li>
            <p>Aucune partie trouvée.</p>
          </li>
        )}
      </ul>
    </section>
  );
};

Games.path = '/games';
