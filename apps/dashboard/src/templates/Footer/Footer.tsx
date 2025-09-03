import { Button, Modal } from 'antd';
import { useState } from 'react';
import { useAuth } from '../../context/AuthProvider';
import classes from './Footer.module.css';

export const Footer = () => {
  const { user, logout } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleLogout = () => {
    logout();
    setIsModalVisible(false);
  };

  return (
    <footer className={classes.footer}>
      <nav aria-label="Navigation du site">
        {user && (
          <Button onClick={() => setIsModalVisible(true)}>
            Se déconnecter
          </Button>
        )}
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
    </footer>
  );
};
