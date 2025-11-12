// © 2025 SmartAir City Team
// Licensed under the MIT License. See LICENSE file for details.

import React, { useState } from 'react';
import useAirQuality from '../hooks/useAirQuality';
import './APIDataViewer.css';

/**
 * API Data Viewer Component
 * Displays raw Air Quality API data
 */
const APIDataViewer = () => {
  const [activeDataset, setActiveDataset] = useState('airQuality');

  // Get data from Air Quality hook only
  const { 
    latestData: airQualityData, 
    alerts, 
    isLoading,
    error 
  } = useAirQuality();

  const datasets = {
    airQuality: {
      title: '🌡️ Air Quality Data',
      data: airQualityData,
      count: airQualityData?.length || 0,
      loading: isLoading,
      error: error
    },
    alerts: {
      title: '⚠️ Alerts Data',
      data: alerts,
      count: alerts?.length || 0,
      loading: isLoading,
      error: error
    }
  };

  const currentDataset = datasets[activeDataset];

  return (
    <div className="api-data-viewer">
      {/* Header */}
      <div className="page-header">
        <h2>📊 API Data Viewer</h2>
        <p className="page-subtitle">
          Xem dữ liệu thô từ Air Quality API (MSW Mock)
        </p>
      </div>

      {/* Dataset Tabs */}
      <div className="dataset-tabs">
        {Object.keys(datasets).map(key => (
          <button
            key={key}
            className={`tab-btn ${activeDataset === key ? 'active' : ''}`}
            onClick={() => setActiveDataset(key)}
          >
            {datasets[key].title}
            <span className="tab-count">{datasets[key].count}</span>
          </button>
        ))}
      </div>

      {/* Dataset Info */}
      <div className="dataset-info">
        <div className="info-item">
          <span className="info-label">📦 Dataset:</span>
          <span className="info-value">{currentDataset.title}</span>
        </div>
        <div className="info-item">
          <span className="info-label">📊 Records:</span>
          <span className="info-value">{currentDataset.count}</span>
        </div>
        <div className="info-item">
          <span className="info-label">⏱️ Status:</span>
          <span className={`status-badge ${currentDataset.loading ? 'loading' : currentDataset.error ? 'error' : 'success'}`}>
            {currentDataset.loading ? '⏳ Loading...' : currentDataset.error ? '❌ Error' : '✅ Ready'}
          </span>
        </div>
      </div>

      {/* Error Display */}
      {currentDataset.error && (
        <div className="error-box">
          <h4>❌ Error Loading Data</h4>
          <p>{currentDataset.error}</p>
        </div>
      )}

      {/* Loading Display */}
      {currentDataset.loading && (
        <div className="loading-box">
          <div className="spinner"></div>
          <p>Loading data...</p>
        </div>
      )}

      {/* Data Display */}
      {!currentDataset.loading && !currentDataset.error && (
        <div className="data-display">
          <div className="data-header">
            <h3>Raw JSON Data</h3>
            <div className="data-actions">
              <button 
                className="btn-copy"
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(currentDataset.data, null, 2));
                  alert('Đã copy JSON vào clipboard!');
                }}
              >
                📋 Copy JSON
              </button>
              <button 
                className="btn-download"
                onClick={() => {
                  const blob = new Blob([JSON.stringify(currentDataset.data, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${activeDataset}-${Date.now()}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                💾 Download JSON
              </button>
            </div>
          </div>

          <pre className="json-viewer">
            <code>{JSON.stringify(currentDataset.data, null, 2)}</code>
          </pre>
        </div>
      )}

      {/* API Endpoints Reference */}
      <div className="api-reference">
        <h3>📚 Air Quality API Endpoints</h3>
        <div className="endpoint-grid">
          <div className="endpoint-card">
            <h4>🌡️ Air Quality API</h4>
            <code>GET /api/airquality</code>
            <code>GET /api/airquality/latest</code>
            <code>GET /api/airquality/history</code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIDataViewer;
