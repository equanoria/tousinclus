import { useEffect, useState } from 'react';
import { backendService } from '../../services/backend/backend.service';
import type { IGame } from '@tousinclus/types';

export const Games = () => {
  const [games, setGames] = useState<IGame[]>([]);

  useEffect(() => {
    const fetchGames = async () => {
      const games = await backendService.getAllGames();
      setGames(games);
    };

    fetchGames();
  }, []);

  return (
    <section>
      <ul>
        {games.length > 0 && games.map((game) => (
          <li key={`${game.code}-${game.createdAt}`}>
            <h3>{game.code}</h3>
            <p>{game.status}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

Games.path = '/games';
