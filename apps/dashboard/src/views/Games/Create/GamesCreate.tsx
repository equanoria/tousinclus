import type { IGame } from '@tousinclus/types';
import { Button, Form, Input, InputNumber, Select } from 'antd';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { backendService } from '../../../services/backend/backend.service';
import type { ICreateGames } from '../../../services/backend/interfaces/CreateGames';
import { directusService } from '../../../services/directus/directus.service';
import classes from './GamesCreate.module.css';

const { Option } = Select;

export const GamesCreate = () => {
  const [deckGroups, setDeckGroups] = useState<{ id: number }[]>([]);
  const [createdGames, setCreatedGames] = useState<IGame[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchDeckGroups = async () => {
      const deckGroups = await directusService.getDeckGroups();
      setDeckGroups(deckGroups);
    };

    fetchDeckGroups();
  }, []);

  const handleFinish = async (values: ICreateGames & { count: number }) => {
    const { count, ...gamesTemplate } = values;

    const createdGames = await backendService.createGames(gamesTemplate, count);
    setCreatedGames(createdGames);
  };

  return (
    <section className={clsx(classes.gamesCreate, 'fillHeight', 'maxWidth')}>
      <section>
        <h1 className="title">Création d’une partie</h1>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          requiredMark="optional"
          className={classes.createForm}
        >
          <div>
            <h2>Étape 1 : choisissez le nombre de parties à créer</h2>
            <Form.Item
              label="Nombre de parties"
              name="count"
              initialValue={1}
              rules={[
                {
                  required: true,
                  message: 'Veuillez préciser le nombre de parties à créer',
                },
              ]}
            >
              <InputNumber
                min={1}
                max={20}
                style={{ width: '100%' }}
                type="number"
              />
            </Form.Item>
          </div>

          <div>
            <h2>Étape 2 : configurez les parties à créer</h2>
            <Form.Item
              label="Nom de l’organisation participante"
              name="organizationName"
              rules={[
                {
                  required: true,
                  message: 'Veuillez entrer le nom de l’organisation',
                },
              ]}
            >
              <Input
                style={{ width: '100%' }}
                type="text"
                placeholder="MonEntreprise"
              />
            </Form.Item>
            <Form.Item
              label="Durée phase de réflexion (en minutes)"
              name="reflectionDuration"
              initialValue={45}
              rules={[
                {
                  required: true,
                  message: 'Veuillez entrer la durée de la phase de réflexion',
                },
              ]}
            >
              <InputNumber
                min={1}
                max={180}
                style={{ width: '100%' }}
                type="number"
              />
            </Form.Item>
            <Form.Item
              label="Nombre de joueurs"
              name="playerAmount"
              initialValue={4}
              rules={[
                {
                  required: true,
                  message:
                    'Veuillez entrer le nombre de joueurs présents dans chaque partie',
                },
              ]}
            >
              <InputNumber
                min={1}
                max={20}
                style={{ width: '100%' }}
                type="number"
              />
            </Form.Item>
            <Form.Item label="Deck personnalisé" name="deckId">
              <Select placeholder="Deck" allowClear>
                {deckGroups.length > 0 &&
                  deckGroups.map((deck) => (
                    <Option key={deck.id} value={deck.id}>
                      Deck {deck.id}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Générer les parties
              </Button>
            </Form.Item>
          </div>
        </Form>
      </section>

      <section>
        {createdGames.length > 0 && (
          <div className={classes.createdGames}>
            <h2>Parties créées ✅</h2>
            <ol>
              {createdGames.map((game) => (
                <li key={`${game.code}-${game.createdAt}`}>
                  <em>{game.code}</em>
                </li>
              ))}
            </ol>
          </div>
        )}
      </section>
    </section>
  );
};

GamesCreate.path = '/games/create';
