import React, { useState } from 'react';
import useDevices from '../hooks/useDevices';
import DeviceList from './DeviceList';
import DeviceForm from './DeviceForm';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import './DeviceManagement.css';

/**
 * Device Management Container
 * Main page for CRUD operations on IoT devices
 */
const DeviceManagement = () => {
  const {
    devices,
    isLoading,
    error,
    fetchDevices,
    createDevice,
    updateDevice,
    deleteDevice
  } = useDevices({ autoFetch: true });

  // UI State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, active, inactive

  // Filter devices based on search and status
  const filteredDevices = devices.filter(device => {
    // Search filter
    const matchesSearch = !searchQuery || 
      device.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.deviceId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.location?.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && device.status === 'Active') ||
      (statusFilter === 'inactive' && device.status !== 'Active');

    return matchesSearch && matchesStatus;
  });

  // Statistics
  const stats = {
    total: devices.length,
    active: devices.filter(d => d.status === 'Active').length,
    inactive: devices.filter(d => d.status !== 'Active').length,
    online: devices.filter(d => d.isOnline).length
  };

  /**
   * Handle Add Device
   */
  const handleAddDevice = () => {
    setEditingDevice(null);
    setIsFormOpen(true);
  };

  /**
   * Handle Edit Device
   */
  const handleEditDevice = (device) => {
    setEditingDevice(device);
    setIsFormOpen(true);
  };

  /**
   * Handle Delete Device
   */
  const handleDeleteDevice = async (deviceId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa thiết bị này?')) {
      return;
    }

    try {
      await deleteDevice(deviceId);
      alert('Đã xóa thiết bị thành công!');
    } catch (err) {
      alert(`Lỗi khi xóa thiết bị: ${err.message}`);
    }
  };

  /**
   * Handle Form Submit (Create or Update)
   */
  const handleFormSubmit = async (deviceData) => {
    try {
      if (editingDevice) {
        // Update existing device
        await updateDevice(editingDevice.id, deviceData);
        alert('Đã cập nhật thiết bị thành công!');
      } else {
        // Create new device
        await createDevice(deviceData);
        alert('Đã thêm thiết bị mới thành công!');
      }
      
      setIsFormOpen(false);
      setEditingDevice(null);
    } catch (err) {
      alert(`Lỗi: ${err.message}`);
    }
  };

  /**
   * Handle Form Cancel
   */
  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingDevice(null);
  };

  /**
   * Handle Refresh
   */
  const handleRefresh = () => {
    fetchDevices();
  };

  return (
    <div className="device-management">
      {/* Header */}
      <div className="device-management-header">
        <div className="header-left">
          <h1>📡 Quản lý Thiết bị IoT</h1>
          <p className="subtitle">Quản lý và giám sát tất cả các cảm biến chất lượng không khí</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-refresh" 
            onClick={handleRefresh}
            disabled={isLoading}
            title="Làm mới dữ liệu"
          >
            🔄 Làm mới
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleAddDevice}
            disabled={isLoading}
          >
            ➕ Thêm thiết bị mới
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="device-stats">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Tổng thiết bị</div>
          </div>
        </div>
        <div className="stat-card stat-success">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{stats.active}</div>
            <div className="stat-label">Đang hoạt động</div>
          </div>
        </div>
        <div className="stat-card stat-warning">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <div className="stat-value">{stats.inactive}</div>
            <div className="stat-label">Không hoạt động</div>
          </div>
        </div>
        <div className="stat-card stat-info">
          <div className="stat-icon">🌐</div>
          <div className="stat-content">
            <div className="stat-value">{stats.online}</div>
            <div className="stat-label">Trực tuyến</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="device-filters">
        <div className="filter-group">
          <label htmlFor="search">🔍 Tìm kiếm:</label>
          <input
            id="search"
            type="text"
            placeholder="Tên thiết bị, Device ID, vị trí..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="filter-input"
          />
        </div>
        
        <div className="filter-group">
          <label htmlFor="status-filter">📊 Trạng thái:</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Tất cả ({stats.total})</option>
            <option value="active">Hoạt động ({stats.active})</option>
            <option value="inactive">Không hoạt động ({stats.inactive})</option>
          </select>
        </div>

        <div className="filter-results">
          Hiển thị <strong>{filteredDevices.length}</strong> / {stats.total} thiết bị
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <ErrorMessage 
          message={error}
          onRetry={handleRefresh}
        />
      )}

      {/* Loading Spinner */}
      {isLoading && <LoadingSpinner />}

      {/* Device List */}
      {!isLoading && !error && (
        <DeviceList
          devices={filteredDevices}
          onEdit={handleEditDevice}
          onDelete={handleDeleteDevice}
        />
      )}

      {/* Device Form Modal */}
      {isFormOpen && (
        <div className="modal-overlay" onClick={handleFormCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <DeviceForm
              device={editingDevice}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceManagement;
