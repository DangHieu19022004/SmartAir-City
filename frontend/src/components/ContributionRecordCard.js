// SmartAir City – IoT Platform for Urban Air Quality Monitoring
// based on NGSI-LD and FiWARE Standards

// SPDX-License-Identifier: MIT
// @version   0.1.x
// @author    SmartAir City Team <smartaircity@gmail.com>
// @copyright © 2025 SmartAir City Team. 
// @license   MIT License
// See LICENSE file in root directory for full license text.
// @see       https://github.com/lequang2009k4/SmartAir-City   SmartAir City Open Source Project

// This software is an open-source component of the SmartAir City initiative.
// It provides real-time environmental monitoring, NGSI-LD–compliant data
// models, MQTT-based data ingestion, and FiWARE Smart Data Models for
// open-data services and smart-city applications. 

import React, { useState } from "react";
import "./ContributionRecordCard.css";

/**
 * Contribution Record Card Component
 * Displays a contribution with metadata and actions
 */
const ContributionRecordCard = ({ contribution, onDownload, onViewData }) => {
  const { contributionId, recordCount, uploadedAt } = contribution;
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="contribution-record-card">
      {/* Header */}
      <div className="record-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="record-icon">📊</div>
        <div className="record-info">
          <h4 className="record-id">ID: {contributionId?.slice(0, 8)}...</h4>
          <p className="record-meta">
            <span className="meta-item">
              <strong>{recordCount || 0}</strong> bản ghi
            </span>
            <span className="meta-divider">•</span>
            <span className="meta-item">
              {formatDate(uploadedAt)}
            </span>
          </p>
        </div>
        <button 
          className="expand-btn"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
        >
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      {/* Actions (shown when expanded) */}
      {isExpanded && (
        <div className="record-actions">
          <button
            className="action-btn btn-view"
            onClick={() => onViewData(contributionId)}
          >
            👁️ Xem dữ liệu
          </button>
          <button
            className="action-btn btn-download"
            onClick={() => onDownload(contributionId)}
          >
            💾 Tải xuống JSON
          </button>
        </div>
      )}
    </div>
  );
};

export default ContributionRecordCard;
