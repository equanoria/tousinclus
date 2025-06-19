import type { IGame } from '@tousinclus/types';
import { Button, Table } from 'antd';
import { useEffect, useState } from 'react';
import { backendService } from '../../services/backend/backend.service';

export const Games = () => {
  const [games, setGames] = useState<IGame[]>([]);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    const games = await backendService.getAllGames().catch(() => {
      return [];
    });
    setGames(games);
  };

  const handleDeleteGame = async (code: string) => {
    await backendService.deleteGame(code);
    fetchGames();
  };

  return (
    <section>
      <Button type="primary" onClick={fetchGames}>
        Rafraîchir
      </Button>
      <p>Dernier rafraîchissement : {new Date().toLocaleString()}</p>
      <Table
        dataSource={games}
        rowKey={(game) => `${game.code}-${game.createdAt}`}
        columns={[
          {
            title: 'Code',
            dataIndex: 'code',
            key: 'code',
          },
          {
            title: 'Groupes de cartes',
            key: 'cardGroup',
            sorter: (a, b) => {
              const aId = a.cardGroupId ?? 0;
              const bId = b.cardGroupId ?? 0;
              if (aId === bId) return 0;
              return aId > bId ? 1 : -1;
            },
            render: (_, game) => (
              <>{`Deck ${game.deckId}, Groupe de cartes ${game.cardGroupId}`}</>
            ),
          },
          {
            title: 'Statut',
            dataIndex: 'status',
            key: 'status',
            sorter: (a, b) => {
              if (a.status === b.status) return 0;
              return a.status > b.status ? 1 : -1;
            },
            render: (_, game) => game.status,
          },
          {
            title: 'Date de création',
            dataIndex: 'createdAt',
            key: 'createdAt',
            sorter: (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
            render: (_, game) => new Date(game.createdAt).toLocaleString(),
          },
          {
            title: 'Actions',
            key: 'actions',
            render: (_, game) => (
              <>
                <Button type="link">Notification question guide</Button>
                <Button
                  type="link"
                  danger
                  onClick={() => handleDeleteGame(game.code)}
                >
                  Clôturer
                </Button>
              </>
            ),
          },
        ]}
        locale={{
          emptyText: 'Aucune partie trouvée.',
        }}
        pagination={false}
      />
    </section>
  );
};

Games.path = '/games';
