import type { IGame } from '@tousinclus/types';
import { Button, Form, InputNumber, Select } from 'antd';
import { useEffect, useState } from 'react';
import { backendService } from '../../../services/backend/backend.service';
import type { ICreateGames } from '../../../services/backend/interfaces/CreateGames';
import { directusService } from '../../../services/directus/directus.service';

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
    <section>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        style={{ maxWidth: 400, margin: '0 auto' }}
      >
        <Form.Item
          label="Parties Count"
          name="count"
          initialValue={1}
          rules={[
            { required: true, message: 'Please enter the number of parties' },
          ]}
        >
          <InputNumber min={1} style={{ width: '100%' }} type="number" />
        </Form.Item>

        <Form.Item
          label="Reflection Duration (minutes)"
          name="reflectionDuration"
          initialValue={45}
          rules={[
            { required: true, message: 'Please enter the party duration' },
          ]}
        >
          <InputNumber min={1} style={{ width: '100%' }} type="number" />
        </Form.Item>

        <Form.Item
          label="Deck Group"
          name="deckId"
          rules={[{ required: true, message: 'Please select a deck' }]}
        >
          <Select placeholder="Select a deck">
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
            Create Game
          </Button>
        </Form.Item>
      </Form>

      {createdGames.length > 0 && (
        <div>
          <h3>Created Games:</h3>
          <ul>
            {createdGames.map((game) => (
              <li key={`${game.code}-${game.createdAt}`}>
                <h4>{game.code}</h4>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

GamesCreate.path = '/games/create';
