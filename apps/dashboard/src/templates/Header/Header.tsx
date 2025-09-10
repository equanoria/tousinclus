import { ExportOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import { Link } from 'react-router-dom';
import { directusService } from '../../services/directus/directus.service';
import { GamesCreate } from '../../views/Games/Create/GamesCreate';
import { GamesExport } from '../../views/Games/Export/GamesExport';
import { Games } from '../../views/Games/Games';
import classes from './Header.module.css';
import { useState } from 'react';
import { useAuth } from '../../context/AuthProvider';

export const Header = () => {
  const { user, logout } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleLogout = () => {
    logout();
    setIsModalVisible(false);
  };

  return (
    <header className={classes.header}>
      <Link to={Games.path}>
        <h1 className="header-title">Dashboard</h1>
      </Link>
      <nav>
        <ul>
          <li>
            <Link to={Games.path}>
              <Button type="text" color="magenta">
                Liste des parties
              </Button>
            </Link>
          </li>
          <li>
            <Link to={GamesCreate.path}>
              <Button type="text">Nouvelle partie</Button>
            </Link>
          </li>
          <li>
            <Link to={GamesExport.path}>
              <Button type="text">Export</Button>
            </Link>
          </li>
          <li>
            <Button
              type="text"
              icon={<ExportOutlined />}
              href={directusService.url}
              target="_blank"
            >
              CMS
            </Button>
          </li>
          <li>
            {user && (
              <Button onClick={() => setIsModalVisible(true)}>
                Se déconnecter
              </Button>
            )}
          </li>
        </ul>
      </nav>

      <Modal
        title="Se déconnecter"
        open={isModalVisible}
        onOk={handleLogout}
        onCancel={() => setIsModalVisible(false)}
        okButtonProps={{ danger: true }}
        okText="Se déconnecter"
      >
        <p>Souhaitez-vous vous déconnecter ?</p>
      </Modal>
    </header>
  );
};
