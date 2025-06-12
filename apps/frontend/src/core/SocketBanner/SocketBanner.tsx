import { useEffect, useState } from 'react';
import { Banner } from '../../components/Banner/Banner';
import { socketService } from '../../services/socket/socket.service';

export const SocketBanner = () => {
  const [banner, setBanner] = useState<JSX.Element | null>(null);

  useEffect(() => {
    socketService
      .on('connect_error', handleConnectError)
      .on('connect', handleReconnect);
  }, []);

  const handleConnectError = () => {
    setBanner(
      <Banner variant="danger" aria-live="polite">
        Impossible de se connecter au serveur...
      </Banner>,
    );
  };

  const handleReconnect = () => {
    setBanner(null);
  };

  return banner;
};
