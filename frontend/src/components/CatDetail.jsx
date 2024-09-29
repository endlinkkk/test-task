import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Spin, Typography, message } from 'antd';
import api from './api';

const { Title } = Typography;

const CatDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cat, setCat] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', age: '', breed: '' });

  useEffect(() => {
    const fetchCat = async () => {
      try {
        const response = await api.get(`/api/cats/${id}/`);
        setCat(response.data);
        setFormData({
          name: response.data.name,
          age: response.data.age,
          breed: response.data.breed,
        });
      } catch (error) {
        handleApiError(error);
      }
    };
    fetchCat();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmit = async (values) => {
    try {
      if (isEditing) {
        await api.put(`/api/cats/${id}/`, values);
        message.success('Кошка успешно обновлена!');
      } else {
        await api.post('/api/cats/', values);
        message.success('Кошка успешно создана!');
      }
      navigate('/cats');
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/cats/${id}/`);
      message.success('Кошка успешно удалена!');
      navigate('/cats');
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleApiError = (error) => {
    if (error.response && error.response.status === 401) {
      navigate('/');
    } else {
      console.error('Ошибка:', error);
      message.error('Произошла ошибка. Попробуйте еще раз.');
    }
  };

  if (!cat) {
    return <Spin size="large" />;
  }

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>{isEditing ? 'Редактировать кошку' : `Имя кошки: ${cat.name}`}</Title>
      <Form
        layout="vertical"
        initialValues={formData}
        onFinish={handleSubmit}
        style={{ maxWidth: '400px' }}
      >
        <Form.Item
          label="Имя кошки"
          name="name"
          rules={[{ required: true, message: 'Пожалуйста, введите имя кошки!' }]}
        >
          <Input disabled={!isEditing} />
        </Form.Item>
        
        <Form.Item
          label="Возраст кошки"
          name="age"
          rules={[{ required: true, message: 'Пожалуйста, введите возраст кошки!' }]}
        >
          <Input type="number" disabled={!isEditing} />
        </Form.Item>
        
        <Form.Item
          label="Порода кошки"
          name="breed"
          rules={[{ required: true, message: 'Пожалуйста, введите породу кошки!' }]}
        >
          <Input disabled={!isEditing} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {isEditing ? 'Сохранить' : 'Создать'}
          </Button>
          <Button type="default" onClick={handleEditToggle} style={{ marginLeft: '10px' }}>
            {isEditing ? 'Отменить редактирование' : 'Редактировать'}
          </Button>
          <Button type="danger" onClick={handleDelete} style={{ marginLeft: '10px' }}>
            Удалить кошку
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CatDetail;