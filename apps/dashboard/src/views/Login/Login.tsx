import { Button, Form, Input } from 'antd';
import styles from './Login.module.css';
import type { ICredentials } from '../../services/auth/auth.service';
import { useAuth } from '../../context/AuthProvider';
import { directusService } from '../../services/directus/directus.service';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import clsx from 'clsx';

const messages = {
  email: 'Veuillez entrer une adresse e-mail valide',
  password: 'Veuillez entrer votre mot de passe',
};

export const Login = () => {
  const { login, user } = useAuth();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/games');
  }, [user, navigate]);

  const onFinish = (credentials: ICredentials) => {
    login(credentials).catch(() => {
      form.setFields([
        {
          name: 'password',
          errors: ['Identifiant ou mot de passe incorrect'],
        },
      ]);
    });
  };

  return (
    <section className={clsx(styles.pageLogin, 'fillHeight')}>
      <div className={styles.pageLoginHeader}>
        <img src="./tousinclus-blue.svg" alt="" />
        <h1 className={`${styles.title} titlePage`}>dashboard</h1>
      </div>

      <Form
        form={form}
        name="login"
        layout="vertical"
        onFinish={onFinish}
        scrollToFirstError
        className={styles.connectionForm}
      >
        <Form.Item
          wrapperCol={{ span: 24 }}
          name="email"
          label="Identifiant"
          rules={[
            {
              type: 'email',
              message: messages.email,
            },
            {
              required: true,
              message: messages.email,
            },
          ]}
        >
          <Input autoComplete="username" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Mot de passe"
          rules={[
            {
              required: true,
              message: messages.password,
            },
          ]}
        >
          <Input.Password autoComplete="current-password" />
        </Form.Item>

        <Form.Item >
          <Button className={styles.submitButton} type="primary" htmlType="submit">
            Se connecter
          </Button>
        </Form.Item>

        <Form.Item>
          <p className={styles.forgotPassword}>
            Mot de passe oublié ? <a href={directusService.resetPasswordUrl}>Réinitialiser</a>
          </p>
        </Form.Item>
      </Form>
    </section>
  );
};

Login.path = '/login';
