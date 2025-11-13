import React from 'react';
import './DeviceCard.css';

/**
 * Device Card Component
 * Displays individual device information
 */
const DeviceCard = ({ device, onToggleStatus, onViewDetails, onDelete }) => {
  // Format location (handle both string and GeoJSON object)
  const formatLocation = (location) => {
    if (!location) return 'N/A';
    
    // If location is a string, return it
    if (typeof location === 'string') return location;
    
    // If location is GeoJSON object with coordinates
    if (location.type === 'Point' && location.coordinates) {
      const [lng, lat] = location.coordinates;
      return `${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`;
    }
    
    // Fallback
    return 'N/A';
  };

  // // Format last seen time
  // const formatLastSeen = (dateString) => {
  //   if (!dateString) return 'Chưa có dữ liệu';
    
  //   const date = new Date(dateString);
  //   const now = new Date();
  //   const diffMs = now - date;
  //   const diffMins = Math.floor(diffMs / 60000);
    
  //   if (diffMins < 1) return 'Vừa xong';
  //   if (diffMins < 60) return `${diffMins} phút trước`;
    
  //   const diffHours = Math.floor(diffMins / 60);
  //   if (diffHours < 24) return `${diffHours} giờ trước`;
    
  //   const diffDays = Math.floor(diffHours / 24);
  //   return `${diffDays} ngày trước`;
  // };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusMap = {
      'Active': { label: 'Hoạt động', className: 'status-active', icon: '✅' },
      'active': { label: 'Hoạt động', className: 'status-active', icon: '✅' },
      'Inactive': { label: 'Không hoạt động', className: 'status-inactive', icon: '⏸️' },
      'inactive': { label: 'Không hoạt động', className: 'status-inactive', icon: '⏸️' },
      'Maintenance': { label: 'Bảo trì', className: 'status-maintenance', icon: '🔧' },
      'maintenance': { label: 'Bảo trì', className: 'status-maintenance', icon: '🔧' },
      'Error': { label: 'Lỗi', className: 'status-error', icon: '❌' },
      'error': { label: 'Lỗi', className: 'status-error', icon: '❌' }
    };
    
    return statusMap[status] || { label: status || 'N/A', className: 'status-unknown', icon: '❓' };
  };

  // Get online status
  const getOnlineStatus = (isOnline) => {
    return isOnline 
      ? { label: 'Trực tuyến', className: 'online-yes', icon: '🟢' }
      : { label: 'Ngoại tuyến', className: 'online-no', icon: '🔴' };
  };

  // Map device fields for display (handle both API format and UI format)
  const displayName = device.deviceName || device.name || 'Unnamed Device';
  const displayDeviceId = device.deviceId || device.id || 'N/A';
  const displayType = device.type || device.deviceType || 'Sensor';
  const displayObservedProperty = device.observedProperty || 'N/A';
  const displayFeatureOfInterest = device.featureOfInterest || 'N/A';

  const statusBadge = getStatusBadge(device.status);
  const onlineStatus = getOnlineStatus(device.status === 'active');

  return (
    <div className={`device-card ${device.status === 'active' ? 'device-online' : 'device-offline'}`}>
      {/* Card Header */}
      <div className="device-card-header">
        <div className="device-icon">📡</div>
        <div className="device-title">
          <h3>{displayName}</h3>
          <span className="device-id">{displayDeviceId}</span>
        </div>
        <div className={`online-indicator ${onlineStatus.className}`} title={onlineStatus.label}>
          {onlineStatus.icon}
        </div>
      </div>

      {/* Card Body */}
      <div className="device-card-body">
        {/* Status */}
        <div className="device-field">
          <span className="field-label">Trạng thái:</span>
          <span className={`status-badge ${statusBadge.className}`}>
            {statusBadge.icon} {statusBadge.label}
          </span>
        </div>

        {/* Device Type */}
        <div className="device-field">
          <span className="field-label">🔧 Loại:</span>
          <span className="field-value">{displayType}</span>
        </div>

        {/* Observed Property */}
        <div className="device-field">
          <span className="field-label">📊 Đo đạc:</span>
          <span className="field-value">{displayObservedProperty}</span>
        </div>

        {/* Feature of Interest */}
        <div className="device-field">
          <span className="field-label">🌍 Khu vực:</span>
          <span className="field-value">{displayFeatureOfInterest.split(':').pop()}</span>
        </div>

        {/* Location */}
        <div className="device-field">
          <span className="field-label">📍 Tọa độ:</span>
          <span className="field-value">{formatLocation(device.location)}</span>
        </div>

        {/* Description */}
        {device.description && (
          <div className="device-field device-description">
            <span className="field-label">📝 Mô tả:</span>
            <p className="field-value">{device.description}</p>
          </div>
        )}
      </div>

      {/* Card Footer - Actions */}
      <div className="device-card-footer">
        <button 
          className={`btn btn-toggle ${device.status === 'active' ? 'btn-toggle-on' : 'btn-toggle-off'}`}
          onClick={() => onToggleStatus(device)}
          title={device.status === 'active' ? 'Tắt thiết bị' : 'Bật thiết bị'}
        >
          {device.status === 'active' ? '⏸️ Tắt' : '▶️ Bật'}
        </button>
        <button 
          className="btn btn-view"
          onClick={() => onViewDetails(device)}
          title="Xem chi tiết thiết bị"
        >
          👁️ Xem
        </button>
        <button 
          className="btn btn-delete"
          onClick={onDelete}
          title="Xóa thiết bị"
        >
          🗑️ Xóa
        </button>
      </div>
    </div>
  );
};

export default DeviceCard;
