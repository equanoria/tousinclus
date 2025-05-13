import {
  Button,
  Form,
  Input,
} from 'antd';
import type { ICredentials } from '../../services/DirectusService';
import { useAppState } from '../../context/AppStateProvider';

const messages = {
  email: 'Veuillez entrer une adresse e-mail valide',
  password: 'Veuillez entrer votre mot de passe',
};

export const GamesList = () => {
  const { directusService } = useAppState();

  const [form] = Form.useForm();

  const onFinish = (credentials: ICredentials) => {
    directusService.login(credentials);
    console.log('Received values of form: ', credentials);
  };

  return (
    <Form
      form={form}
      name="login"
      onFinish={onFinish}
      scrollToFirstError
    >
      <Form.Item
        name="email"
        label="E-mail"
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
        name="password"
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

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Se connecter
        </Button>
      </Form.Item>
    </Form>
  );
};
