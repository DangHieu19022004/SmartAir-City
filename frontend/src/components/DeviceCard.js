import React from 'react';
import './DeviceCard.css';

/**
 * Device Card Component
 * Displays individual device information
 */
const DeviceCard = ({ device, onEdit, onDelete }) => {
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

  // Format last seen time
  const formatLastSeen = (dateString) => {
    if (!dateString) return 'Chưa có dữ liệu';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} giờ trước`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} ngày trước`;
  };

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

  const statusBadge = getStatusBadge(device.status);
  const onlineStatus = getOnlineStatus(device.isOnline);

  // Map device fields for display (handle both API format and UI format)
  const displayName = device.name || device.deviceName || 'Unnamed Device';
  const displayDeviceId = device.deviceId || device.id || 'N/A';
  const displayType = device.deviceType || device.type || 'Air Quality Sensor';

  return (
    <div className={`device-card ${device.isOnline ? 'device-online' : 'device-offline'}`}>
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

        {/* Location */}
        <div className="device-field">
          <span className="field-label">📍 Vị trí:</span>
          <span className="field-value">{formatLocation(device.location)}</span>
        </div>

        {/* Device Type */}
        <div className="device-field">
          <span className="field-label">🔧 Loại:</span>
          <span className="field-value">{displayType}</span>
        </div>

        {/* Last Seen */}
        <div className="device-field">
          <span className="field-label">🕐 Cập nhật:</span>
          <span className="field-value">{formatLastSeen(device.lastSeen)}</span>
        </div>

        {/* Firmware Version */}
        {device.firmwareVersion && (
          <div className="device-field">
            <span className="field-label">⚙️ Firmware:</span>
            <span className="field-value">{device.firmwareVersion}</span>
          </div>
        )}

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
          className="btn btn-edit"
          onClick={onEdit}
          title="Chỉnh sửa thiết bị"
        >
          ✏️ Sửa
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
