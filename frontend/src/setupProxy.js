// © 2025 SmartAir City Team
// Licensed under the MIT License. See LICENSE file for details.

/**
 * Development Proxy Configuration
 * 
 * This file configures a proxy for the development server to bypass CORS issues.
 * React automatically uses this file when running `npm start`.
 * 
 * Note: This only works in development. For production, the backend must
 * configure proper CORS headers.
 */

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy Core API requests (Devices, Users, Auth)
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.REACT_APP_CORE_API_URL || 'http://3.27.249.236:5252',
      changeOrigin: true,
      secure: false,
      logLevel: 'debug',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      onProxyReq: (proxyReq, req, res) => {
        const targetUrl = `${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`;
        console.log('🔀 [Proxy] Forwarding:', req.method, req.url, '→', targetUrl);
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log('✅ [Proxy] Response:', proxyRes.statusCode, 'from', req.url);
        console.log('📋 [Proxy] Headers:', proxyRes.headers);
      },
      onError: (err, req, res) => {
        console.error('❌ [Proxy] Error:', err.message, 'for', req.url);
        console.error('📋 [Proxy] Error details:', err);
      }
    })
  );
};
