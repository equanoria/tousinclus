import { Button, Form, Input } from 'antd';
import { directusService, type ICredentials } from '../../services/DirectusService';
import styles from './DashboardConnection.module.css';

const messages = {
  email: 'Veuillez entrer une adresse e-mail valide',
  password: 'Veuillez entrer votre mot de passe',
};

export const DashboardConnection = () => {
  const [form] = Form.useForm();
  const onFinish = (credentials: ICredentials) => {
    directusService.login(credentials);
    console.log('Received values of form: ', credentials);
  };

  return (
    <section className={styles.pageConnection}>
      <div className={styles.pageConnectionHeader}>
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
          name="Identifiant"
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
          <Input />
        </Form.Item>

        <Form.Item
          name="Mot de passe"
          label="Mot de passe"
          rules={[
            {
              required: true,
              message: messages.password,
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item >
          <Button className={styles.submitButton} type="primary" htmlType="submit">
            Se connecter
          </Button>
        </Form.Item>
      </Form>
    </section>
  );
};
