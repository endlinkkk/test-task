import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { List, Button, Modal, Form, Input } from 'antd';
import api from './api';

const { TextArea } = Input;

async function fetchUserFromBackend() {
    try {
        const response = await api.get('/auth/users/me');
        return response.data;
    } catch (error) {
        console.error('Error fetching user ID:', error);
        return null;
    }
}

async function getUser() {
    let userId = localStorage.getItem('user_id');
    let username = localStorage.getItem('username')
    if (!userId || !username) {
        let user = await fetchUserFromBackend();
        userId = user.id
        username = user.username
        if (userId) {
            localStorage.setItem('user_id', userId);
        }
        if (username) {
            localStorage.setItem('username', username);
        }
    }
    return userId;
}

const BreederDetail = () => {
    const { id } = useParams();
    const [cats, setCats] = useState([]);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [userId, setUserId] = useState(null);
    
    const ws = useRef(null);


    useEffect(() => {
        const loadUserId = async () => {
            try {
                const fetchedUserId = await getUser();
                setUserId(fetchedUserId);
            } catch (error) {
                console.error('Error loading user ID:', error);
            }
        };
        
        loadUserId();
    }, []); 

    useEffect(() => {
        const fetchCatsByBreeder = async () => {
            try {
                const response = await api.get(`/api/breeders/${id}/cats/`);
                setCats(response.data);
            } catch (error) {
                if (error.response && error.response.status === 401) {

                  navigate('/');
                } else {
                  console.error('Ошибка при получении кошек заводчика:', error);
                }
              }
        };
        fetchCatsByBreeder();
    }, [id]);

    useEffect(() => {
        if (!userId) return; 

        const roomName = `room_${Math.min(userId, id)}_${Math.max(userId, id)}`;
        console.log(userId, id)
        ws.current = new WebSocket(`ws://localhost:8000/ws/chat/${roomName}`);

        ws.current.onopen = () => {
            console.log('WebSocket connection established');
        };

        ws.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setMessages(prevMessages => [...prevMessages, message]);
        };

        ws.current.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        ws.current.onclose = () => {
            console.log('WebSocket connection closed');
        };

        return () => {
            ws.current.close();
        };
    }, [userId]); // Зависимость от userId

    const sendMessage = (message) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
            const timestamp = new Date().toLocaleString();
            ws.current.send(JSON.stringify({ 
                sender: localStorage.getItem('username'), 
                text: message, 
                timestamp 
            }));
            setCurrentMessage('');
        } else {
            console.error('WebSocket is not open. Unable to send message.');
        }
    };

    return (
      <>
          <h2>Кошки заводчика</h2>
          <List
              bordered
              dataSource={cats}
              renderItem={(cat) => (
                  <List.Item>
                      <p>{cat.name}</p>
                  </List.Item>
              )}
          />
          <Button 
              onClick={() => setIsChatOpen(true)}
          >
              Чат с заводчиком
          </Button>

          {isChatOpen && (
              <Modal
                  title="Чат с заводчиком"
                  open={isChatOpen}
                  footer={[
                      <Button key="back" onClick={() => setIsChatOpen(false)}>
                          Отмена
                      </Button>,
                      <Button key="submit" type="primary" onClick={() => sendMessage(currentMessage)} disabled={!currentMessage}>
                          Отправить
                      </Button>,
                  ]}
                  onCancel={() => setIsChatOpen(false)}
              >
                  <div style={{ height: '400px', overflowY: 'auto' }}>
                      {messages.map((message, index) => (
                          <div key={index} style={{ marginBottom: '10px' }}>
                              <span style={{ fontWeight: message.sender === "DebugUsername" ? 'bold' : 'normal' }}>
                                  {message.sender}: {message.text} 
                                  <span style={{ fontSize: '0.8em', marginLeft: '10px', color: '#aaa' }}>
                                      ({message.timestamp})
                                  </span>
                              </span>
                          </div>
                      ))}
                  </div>
                  <Form.Item>
                      <TextArea
                          rows={4}
                          value={currentMessage}
                          onChange={(e) => setCurrentMessage(e.target.value)}
                          placeholder="Введите сообщение..."
                      />
                  </Form.Item>
              </Modal>
          )}
      </>
  );
};

export default BreederDetail;