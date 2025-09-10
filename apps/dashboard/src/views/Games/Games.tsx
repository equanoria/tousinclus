import { DeleteOutlined, SyncOutlined } from '@ant-design/icons';
import type { IGame } from '@tousinclus/types';
import { Button, Modal, Table } from 'antd';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { backendService } from '../../services/backend/backend.service';
import classes from './Games.module.css';

export const Games = () => {
  const [gameToDelete, setGameToDelete] = useState<IGame | null>(null);
  const [deleteAllGames, setDeleteAllGames] = useState<boolean>(false);
  const [games, setGames] = useState<IGame[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    setLoading(true);
    const games = await backendService.getAllGames().catch(() => {
      return [];
    });
    setLoading(false);
    setGames(games);
  };

  const handleDeleteGame = async (code: string) => {
    await backendService.deleteGame(code);
    setGameToDelete(null);
    fetchGames();
  };

  const handleDeleteAllGames = async () => {
    await backendService.deleteAllGames();
    setDeleteAllGames(false);
    fetchGames();
  };

  const now = new Date();

  return (
    <section className={clsx(classes.games, 'fillHeight', 'maxWidth')}>
      <hgroup className="title">
        <h1>
          Liste des parties{' '}
          <Button
            onClick={fetchGames}
            icon={<SyncOutlined />}
            iconPosition="end"
          />{' '}
        </h1>
        <p>
          Mise à jour à{' '}
          <time dateTime={now.toISOString()}>
            {now.toLocaleTimeString('fr-FR')}
          </time>
        </p>
      </hgroup>
      <Table
        dataSource={games}
        rowKey={(game) => `${game.code}-${game.createdAt}`}
        loading={loading}
        bordered
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
              <>
                Deck {game.deckId}, Groupe de cartes {game.cardGroupId}
              </>
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
            render: (_, game) =>
              new Date(game.createdAt).toLocaleString('fr-FR'),
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
                  onClick={() => setGameToDelete(game)}
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
        pagination={{ pageSize: 10 }}
      />

      <div className={classes.actions}>
        <Button
          danger
          onClick={() => setDeleteAllGames(true)}
          icon={<DeleteOutlined />}
        >
          Clôturer toutes les parties
        </Button>
      </div>

      <Modal
        title="Clôture de partie"
        open={!!gameToDelete}
        onOk={() => {
          if (gameToDelete) handleDeleteGame(gameToDelete.code);
        }}
        onCancel={() => setGameToDelete(null)}
        okButtonProps={{ danger: true }}
        okText="Clôturer"
        cancelText="Annuler"
      >
        <p>Souhaitez-vous clôturer {gameToDelete?.code} ?</p>
      </Modal>

      <Modal
        title="Clôturer toutes les parties"
        open={deleteAllGames}
        onOk={handleDeleteAllGames}
        onCancel={() => setDeleteAllGames(false)}
        okButtonProps={{ danger: true }}
        okText="Clôturer toutes les parties"
        cancelText="Annuler"
      >
        <p>Êtes-vous sûr de vouloir clôturer toutes les parties ?</p>
        <p>Cette action est irréversible.</p>
      </Modal>
    </section>
  );
};

Games.path = '/games';
