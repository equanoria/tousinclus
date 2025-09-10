import { useState } from 'react';
import { backendService } from '../../../services/backend/backend.service';
import clsx from 'clsx';
import classes from './GamesExport.module.css';
import { DatePicker, Button, Alert, Form } from 'antd';
import dayjs from 'dayjs';

export const GamesExport = () => {
  const [date, setDate] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setLoading(true);
    setError(null);
    try {
      const exportDate = new Date(date);
      const blob = await backendService.exportGames(exportDate);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `games-export-${date}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Aucune partie trouvée à cette date');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={clsx('fillHeight', 'maxWidth', classes.gamesExport)}>
      <div>
      <hgroup className="title">
        <h1>Export des parties</h1>
        <p>Exportez toutes les parties pour une date donnée</p>
      </hgroup>
      <Form
        layout="vertical"
        onFinish={handleExport}
        requiredMark="optional"
      >
        <Form.Item
        label="Date d'export"
        name="date"
        rules={[{ required: true, message: 'Veuillez sélectionner une date' }]}
        >
        <DatePicker
          value={date ? dayjs(date) : null}
          onChange={(_, dateString) => {
          if (typeof dateString === 'string') {
            const parsed = dayjs(dateString, 'DD-MM-YYYY');
            if (parsed.isValid()) {
            setDate(parsed.format('YYYY-MM-DD'));
            } else {
            setDate('');
            }
          } else {
            setDate('');
          }
          }}
          maxDate={dayjs().endOf('day')}
          disabled={loading}
          placeholder="Date"
          format={'DD-MM-YYYY'}
        />
        </Form.Item>
        <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
        >
          Télécharger les parties
        </Button>
        </Form.Item>
        {error && (
          <Alert
            type="warning"
            message={error}
            showIcon
            closable
            onClose={() => setError(null)}
          />
        )}
      </Form>
      </div>
    </section>
  );
};

GamesExport.path = '/games/export';
