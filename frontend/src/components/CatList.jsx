import React, { useEffect, useState } from 'react';
import { List, Button, Modal, Form, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import api from './api';

const CatList = () => {
  const [cats, setCats] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await api.get('/api/cats/');
        setCats(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate('/');
        } else {
          console.error('Ошибка при загрузке кошек:', error);
        }
      }
    };
    fetchCats();
  }, []);

  const handleNavigate = () => {
    navigate('/breeders');
  };

  const handleCreateCat = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await api.post('/api/cats/', values);
      // Optionally fetch cats again or update local state
      setCats([...cats, values]); // Update local state with new cat
      form.resetFields(); // Reset form fields
      setIsModalVisible(false); // Close modal
    } catch (error) {
      console.error('Ошибка при создании кошки:', error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <h2>Мои кошки</h2>
      <List
        bordered
        dataSource={cats}
        renderItem={cat => (
          <List.Item>
            <Link to={`/cats/${cat.id}`}>{cat.name}</Link>
          </List.Item>
        )}
      />
      <Button onClick={handleCreateCat} type="primary" style={{ marginBottom: '10px' }}>
        Создать новую кошку
      </Button>
      <Button onClick={handleNavigate}>Заводчики</Button>

      {/* Modal for creating a new cat */}
      <Modal
        title="Создать новую кошку"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Имя"
            rules={[{ required: true, message: 'Пожалуйста, введите имя кошки!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="age"
            label="Возраст"
            rules={[{ required: true, message: 'Пожалуйста, введите возраст кошки!' }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="breed"
            label="Порода"
            rules={[{ required: true, message: 'Пожалуйста, введите породу кошки!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CatList;