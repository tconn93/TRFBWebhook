import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Get user info
    setUserEmail(localStorage.getItem('userEmail') || '');
    setUserName(localStorage.getItem('userName') || '');
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="dashboard-logo">
          <span className="logo-icon">⚡</span>
          <h1>FB Webhook Pro</h1>
        </div>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </nav>

      <div className="dashboard-content">
        <header className="dashboard-header">
          <h2>Welcome{userName ? `, ${userName}` : ''}! 👋</h2>
          <p className="user-email">{userEmail}</p>
        </header>

        <div className="dashboard-grid">
          <div className="dashboard-card card-webhooks">
            <div className="card-icon">📡</div>
            <h3>Active Webhooks</h3>
            <p className="card-number">0</p>
            <p className="card-description">Webhook endpoints configured</p>
          </div>

          <div className="dashboard-card card-events">
            <div className="card-icon">📊</div>
            <h3>Events Today</h3>
            <p className="card-number">0</p>
            <p className="card-description">Webhook events received</p>
          </div>

          <div className="dashboard-card card-status">
            <div className="card-icon">✅</div>
            <h3>System Status</h3>
            <p className="card-number">Operational</p>
            <p className="card-description">All systems running smoothly</p>
          </div>

          <div className="dashboard-card card-uptime">
            <div className="card-icon">⏱️</div>
            <h3>Uptime</h3>
            <p className="card-number">99.9%</p>
            <p className="card-description">Last 30 days</p>
          </div>
        </div>

        <div className="quick-start-section">
          <h3>Quick Start Guide</h3>
          <div className="steps-container">
            <div className="step-card">
              <div className="step-number">1</div>
              <h4>Configure Your Facebook App</h4>
              <p>Set up your Facebook App and get your App ID and App Secret</p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <h4>Add Webhook Endpoint</h4>
              <p>Create a new webhook endpoint and configure the verification token</p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <h4>Subscribe to Events</h4>
              <p>Choose which Facebook events you want to receive webhooks for</p>
            </div>

            <div className="step-card">
              <div className="step-number">4</div>
              <h4>Start Receiving Webhooks</h4>
              <p>Monitor your webhook activity in real-time from this dashboard</p>
            </div>
          </div>
        </div>

        <div className="coming-soon">
          <h3>🚧 Dashboard Features Coming Soon</h3>
          <ul>
            <li>Webhook endpoint management</li>
            <li>Real-time event monitoring</li>
            <li>Detailed analytics and logs</li>
            <li>Event payload inspection</li>
            <li>Custom webhook configurations</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
