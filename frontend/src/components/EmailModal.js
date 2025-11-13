import React, { useState, useEffect } from 'react';
import { usersService } from '../services';
import { useAirQualityContext } from '../contexts/AirQualityContext';
import './EmailModal.css';

/**
 * Email Modal Component
 * Modal for sending emails to users with AQI information
 */
const EmailModal = ({ isOpen, onClose, recipient, users = [] }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { latestData } = useAirQualityContext();

  // Generate default AQI message
  useEffect(() => {
    if (isOpen && latestData) {
      const defaultMessage = `Thông báo chất lượng không khí:\n\nChỉ số AQI hiện tại: ${latestData.aqi || 'N/A'}\n${getAQIDescription(latestData.aqi)}\n\nCác chỉ số chi tiết:\n- PM2.5: ${latestData.pm25 || 'N/A'} µg/m³\n- PM10: ${latestData.pm10 || 'N/A'} µg/m³\n- CO: ${latestData.co || 'N/A'} ppm\n- SO2: ${latestData.so2 || 'N/A'} µg/m³\n- NO2: ${latestData.no2 || 'N/A'} µg/m³\n- O3: ${latestData.o3 || 'N/A'} µg/m³\n\nCập nhật lúc: ${new Date().toLocaleString('vi-VN')}`;
      setMessage(defaultMessage);
    }
  }, [isOpen, latestData]);

  const getAQIDescription = (aqi) => {
    if (!aqi) return '';
    if (aqi <= 50) return '✅ Chất lượng không khí tốt';
    if (aqi <= 100) return '⚠️ Chất lượng không khí trung bình';
    if (aqi <= 150) return '🔶 Không lành mạnh cho nhóm nhạy cảm';
    if (aqi <= 200) return '🔴 Không lành mạnh';
    if (aqi <= 300) return '🟣 Rất không lành mạnh';
    return '🟤 Nguy hại';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      alert('Vui lòng nhập nội dung email!');
      return;
    }

    setIsSending(true);

    try {
      if (recipient) {
        // Send to single user
        const result = await usersService.sendEmail(recipient.email, message);
        alert(result.message || `Đã gửi email tới ${recipient.email}`);
      } else {
        // Send bulk email to all users
        const emailPromises = users.map((user) => 
          usersService.sendEmail(user.email, message)
        );
        
        await Promise.all(emailPromises);
        alert(`Đã gửi email tới ${users.length} người dùng thành công!`);
      }

      onClose();
      setMessage('');
    } catch (error) {
      console.error('Error sending email:', error);
      alert(`Lỗi khi gửi email: ${error.message}`);
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="email-modal-overlay" onClick={onClose}>
      <div className="email-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="email-modal-header">
          <h2>
            📧 {recipient ? `Gửi email tới ${recipient.name || recipient.email}` : `Gửi email hàng loạt (${users.length} người)`}
          </h2>
          <button className="email-modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="email-modal-body">
            {recipient && (
              <div className="recipient-info">
                <strong>Người nhận:</strong> {recipient.email}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="message">Nội dung email:</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Nhập nội dung email..."
                rows={12}
                disabled={isSending}
                required
              />
            </div>

            <div className="email-info">
              💡 Nội dung mặc định bao gồm thông tin AQI realtime. Bạn có thể chỉnh sửa trước khi gửi.
            </div>
          </div>

          <div className="email-modal-footer">
            <button 
              type="button" 
              className="btn btn-cancel" 
              onClick={onClose}
              disabled={isSending}
            >
              Hủy
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSending}
            >
              {isSending ? '⏳ Đang gửi...' : '📤 Gửi email'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailModal;
