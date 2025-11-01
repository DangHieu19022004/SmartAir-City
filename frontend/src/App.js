import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import { generateMockStations, generateHistoricalData } from './data/mockData';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [stations, setStations] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);

  // Khởi tạo dữ liệu khi component mount
  useEffect(() => {
    const initialStations = generateMockStations();
    const initialHistory = generateHistoricalData();
    
    setStations(initialStations);
    setHistoricalData(initialHistory);
    
    console.log('Stations loaded:', initialStations);
    console.log('Historical data loaded:', initialHistory);
  }, []);

  return (
    <div className="App">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="main-content">
        <h2>Tab hiện tại: {activeTab}</h2>
        <div className="data-preview">
          <h3>Dữ liệu đã tải</h3>
          <p>Số trạm đo: {stations.length}</p>
          <p>Dữ liệu lịch sử: {historicalData.length} điểm</p>
          
          {stations.length > 0 && (
            <div className="station-sample">
              <h4>Ví dụ trạm đầu tiên:</h4>
              <pre>{JSON.stringify(stations[0], null, 2)}</pre>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
