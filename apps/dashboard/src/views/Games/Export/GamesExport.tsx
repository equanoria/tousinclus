import { useState } from 'react';
import { backendService } from '../../../services/backend/backend.service';

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
      setError('Export failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        disabled={loading}
      />
      <button type="button" onClick={handleExport} disabled={!date || loading}>
        {loading ? 'Exporting...' : 'Export Games'}
      </button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

GamesExport.path = '/games/export';
