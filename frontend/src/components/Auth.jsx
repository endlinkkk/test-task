import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from './api';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/auth/users/me/', {
            headers: {
              Authorization: `Token ${token}`,
            },
          });
          if (response.status === 200) {
            navigate('/cats');
          }
        } catch (error) {
          console.error('Ошибка проверки статуса аутентификации:', error);
        }
      }
    };

    checkAuthStatus();
  }, [navigate]);

  const onFinish = async (values) => {
    try {
      const url = isLogin ? '/auth/token/login/' : '/auth/users/';
      const response = await api.post(url, values);

      if (isLogin) {
        // Сохраните токен в локальное хранилище или состояние
        localStorage.setItem('token', response.data.auth_token);
        
        message.success("Вы успешно вошли!");
        // Перенаправление на страницу кошек
        navigate('/cats');
      } else {
        message.success("Вы успешно зарегистрировались! Пожалуйста, войдите.");
        localStorage.setItem('user_id', response.data.id);
        setIsLogin(true); // После регистрации переключаем на форму входа
      }
    } catch (error) {
      message.error('Ошибка при авторизации: ' + (error.response?.data?.non_field_errors || 'Неверные данные'));
    }
  };

  return (
    <Form form={form} onFinish={onFinish}>
      <Form.Item name="username" rules={[{ required: true, message: 'Введите имя пользователя!' }]}>
        <Input placeholder="Имя пользователя" />
      </Form.Item>
      <Form.Item name="password" rules={[{ required: true, message: 'Введите пароль!' }]}>
        <Input.Password placeholder="Пароль" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {isLogin ? 'Войти' : 'Зарегистрироваться'}
        </Button>
        <Button type="link" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Нет аккаунта? Зарегистрируйтесь!' : 'Уже есть аккаунт? Войдите!'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Auth;