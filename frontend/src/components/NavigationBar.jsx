import React from 'react';
import { Layout, Button, Space, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from './api'; 

const { Header } = Layout;

const NavigationBar = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); 
  };

  const handleHome = () => {
    navigate('/cats');
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await api.post('/auth/token/logout/', {}, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        localStorage.removeItem('token'); 
        message.success("Вы успешно вышли из системы!");
        navigate('/'); 
      }
    } catch (error) {
      console.error('Ошибка при выходе:', error);
      message.error('Ошибка при выходе из системы. Попробуйте еще раз.');
    }
  };

  return (
    <Header style={{ background: '#fff', padding: '0 20px', boxShadow: '0 2px 8px rgba(0, 21, 41, 0.1)' }}>
      <Space>
        <Button type="primary" onClick={handleHome}>
          Домой
        </Button>
        <Button onClick={handleBack}>
          Назад
        </Button>
        <Button color="red" onClick={handleLogout}>
          Выйти
        </Button>
      </Space>
    </Header>
  );
};

export default NavigationBar;