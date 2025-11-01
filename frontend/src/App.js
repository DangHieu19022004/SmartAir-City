import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="App">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="main-content">
        <h2>{activeTab}</h2>
      </main>
    </div>
  );
}

export default App;
