import { Button, Form, Input, Typography } from 'antd';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import tousinclusLogoWhite from '../../assets/images/logo-tousinclus-white.svg';
import { useAuth } from '../../context/AuthProvider';
import type { ICredentials } from '../../services/auth/auth.service';
import { directusService } from '../../services/directus/directus.service';
import styles from './Login.module.css';

const messages = {
  email: 'Veuillez entrer une adresse e-mail valide',
  password: 'Veuillez entrer votre mot de passe',
};

export const Login = () => {
  const { login, user } = useAuth();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user) navigate('/games');
  }, [user, navigate]);

  const onFinish = (credentials: ICredentials) => {
    setLoading(true);
    login(credentials).catch(() => {
      form.setFields([
        {
          name: 'password',
          errors: ['Identifiant ou mot de passe incorrect'],
        },
      ]);

      setLoading(false);
    });
  };

  return (
    <section className={clsx(styles.login, 'fillHeight')}>
      <div className={styles.logo}>
        <img src={tousinclusLogoWhite} alt="" />
      </div>

      <div>
        <h1 className={clsx('title', styles.title)}>Accès au dashboard</h1>
        <Form
          form={form}
          name="login"
          layout="vertical"
          onFinish={onFinish}
          scrollToFirstError
          className={styles.connectionForm}
          requiredMark="optional"
        >
          <Form.Item
            wrapperCol={{ span: 24 }}
            name="email"
            label="Adresse e-mail"
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
          <Form.Item>
            <Button
              className={styles.submitButton}
              block
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              Se connecter
            </Button>
          </Form.Item>
          <Form.Item>
            <p className={styles.forgotPassword}>
              Mot de passe oublié ?{' '}
              <Typography.Link href={directusService.resetPasswordUrl}>
                Réinitialiser
              </Typography.Link>
            </p>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
};

Login.path = '/login';
