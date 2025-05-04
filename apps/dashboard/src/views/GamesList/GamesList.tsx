import { useAppState } from '../../context/AppStateProvider';
import styles from './GamesList.module.css';
import {
  Button,
  Form,
  Input,
} from 'antd';

const messages = {
  email: 'Veuillez entrer une adresse e-mail valide',
  password: 'Veuillez entrer votre mot de passe',
};

export const GamesList = () => {
  const { directusService } = useAppState();
  const [form] = Form.useForm();

  const onFinish = (values: unknown) => {
    console.log('Received values of form: ', values);
  };

  return (
    <Form
      form={form}
      name="register"
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
        label="Password"
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
          Log In
        </Button>
      </Form.Item>
    </Form>
  );
};
