// © 2025 SmartAir City Team
// Licensed under the MIT License. See LICENSE file for details.

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAirQualityContext } from "../contexts/AirQualityContext";
import "./AirQualityChart.css";

/**
 * Air Quality Chart Component
 * Displays real-time trends of AQI and pollutants
 */
const AirQualityChart = () => {
  const { latestData, isConnected } = useAirQualityContext();
  const [chartData, setChartData] = useState([]);
  const [maxDataPoints] = useState(20); // Keep last 20 data points

  // Update chart data when new data arrives
  useEffect(() => {
    if (!latestData || latestData.length === 0) return;

    // Get the most recent station data
    const station = latestData[0];

    const newDataPoint = {
      time: new Date(
        station.dateObserved || station.timestamp
      ).toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      timestamp: station.timestamp || new Date(station.dateObserved).getTime(),
      AQI: Math.round(station.aqi || 0),
      CO: parseFloat((station.co || 0).toFixed(2)),
      SO2: parseFloat((station.so2 || 0).toFixed(2)),
      NO2: parseFloat((station.no2 || 0).toFixed(2)),
      O3: parseFloat((station.o3 || 0).toFixed(2)),
      PM10: parseFloat((station.pm10 || 0).toFixed(2)),
      "PM2.5": parseFloat((station.pm25 || 0).toFixed(2)),
    };

    setChartData((prevData) => {
      // Avoid duplicates by checking timestamp
      const lastPoint = prevData[prevData.length - 1];
      if (lastPoint && lastPoint.timestamp === newDataPoint.timestamp) {
        return prevData;
      }

      // Add new point and keep only last N points
      const updatedData = [...prevData, newDataPoint].slice(-maxDataPoints);
      return updatedData;
    });
  }, [latestData, maxDataPoints]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-time">{payload[0].payload.time}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: <strong>{entry.value}</strong>
              {entry.name === "AQI" ? "" : " µg/m³"}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>Biểu đồ theo dõi chất lượng không khí</h3>
        {isConnected && <span className="realtime-indicator">🟢 Realtime</span>}
      </div>

      {chartData.length === 0 ? (
        <div className="chart-empty">
          <p>⏳ Đang chờ dữ liệu realtime...</p>
        </div>
      ) : (
        <>
          {/* Main Chart - AQI and Pollutants */}
          <div className="chart-wrapper">
            <h4 className="chart-subtitle">AQI và các chất ô nhiễm (µg/m³)</h4>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="time"
                  stroke="#6b7280"
                  style={{ fontSize: "12px" }}
                />
                <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "14px" }} iconType="line" />

                {/* AQI - Purple */}
                <Line
                  type="monotone"
                  dataKey="AQI"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />

                {/* SO2 - Orange */}
                <Line
                  type="monotone"
                  dataKey="SO2"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />

                {/* NO2 - Red */}
                <Line
                  type="monotone"
                  dataKey="NO2"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />

                {/* O3 - Blue */}
                <Line
                  type="monotone"
                  dataKey="O3"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />

                {/* PM10 - Green */}
                <Line
                  type="monotone"
                  dataKey="PM10"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />

                {/* PM2.5 - Teal */}
                <Line
                  type="monotone"
                  dataKey="PM2.5"
                  stroke="#14b8a6"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Separate CO Chart */}
          <div className="chart-wrapper chart-secondary">
            <h4 className="chart-subtitle">Carbon Monoxide - CO (ppm)</h4>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="time"
                  stroke="#6b7280"
                  style={{ fontSize: "12px" }}
                />
                <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "14px" }} iconType="line" />

                {/* CO - Brown */}
                <Line
                  type="monotone"
                  dataKey="CO"
                  stroke="#92400e"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      <div className="chart-info">
        <p>
          💡 Biểu đồ hiển thị {maxDataPoints} điểm dữ liệu gần nhất, tự động cập
          nhật khi có dữ liệu mới
        </p>
      </div>
    </div>
  );
};

export default AirQualityChart;
