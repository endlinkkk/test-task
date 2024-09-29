import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd'; 
import NavigationBar from './components/NavigationBar'; 
import Auth from './components/Auth'; 
import CatList from './components/CatList'; 
import BreederList from './components/BreederList'; 
import BreederDetail from './components/BreederDetail'; 
import CatDetail from './components/CatDetail'; 
import { useLocation } from 'react-router-dom'; 

const App = () => {
    const location = useLocation(); 
  
    return (
      <Layout>
        {/* Условно отображаем NavigationBar в зависимости от текущего пути */}
        {location.pathname !== '/' && <NavigationBar />}
        <Layout.Content style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/cats" element={<CatList />} /> 
            <Route path="/breeders" element={<BreederList />} /> 
            <Route path="/breeders/:id" element={<BreederDetail />} /> 
            <Route path="/cats/:id" element={<CatDetail />} /> 
          </Routes>
        </Layout.Content>
      </Layout>
    );
  };
  
  export default App;