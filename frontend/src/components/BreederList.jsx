import React, { useEffect } from 'react';
import { List } from 'antd';
import { Link } from 'react-router-dom';
import api from './api';

const BreederList = ({ breeders }) => {
  const [listItems, setListItems] = React.useState([]);

  useEffect(() => {
    const fetchBreeders = async () => {
      try {
        const response = await api.get('/api/breeders/');
        const data = response.data || [];
        setListItems(data);
        console.log('Загруженные заводчики:', data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Если получен статус 401, перенаправляем на страницу входа
          navigate('/');
        } else {
          console.error('Ошибка при загрузке заводчиков:', error);
        }
      }
    };
    fetchBreeders();
  }, []);

  return (
    <div>
      {listItems.length > 0 ? (
        <List
          itemLayout="horizontal"
          dataSource={listItems}
          renderItem={breeder => (
            <List.Item>
              <Link to={`/breeders/${breeder.id}`}>{breeder.username}</Link>
            </List.Item>
          )}
        />
      ) : (
        <div>Загрузка заводчиков...</div>
      )}
    </div>
  );
};

export default BreederList;
