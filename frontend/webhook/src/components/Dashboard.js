import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getTargets, createTarget, updateTarget, deleteTarget, testTarget } from '../services/api';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [targets, setTargets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTarget, setNewTarget] = useState({
    name: '',
    url: '',
    active: true
  });
  const [error, setError] = useState('');

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

    // Load targets
    loadTargets();
  }, [navigate]);

  const loadTargets = async () => {
    try {
      setLoading(true);
      const response = await getTargets();
      setTargets(response.targets || []);
    } catch (error) {
      console.error('Failed to load targets:', error);
      setError('Failed to load webhook targets');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      navigate('/');
    }
  };

  const handleAddTarget = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await createTarget(newTarget);
      setShowAddModal(false);
      setNewTarget({ name: '', url: '', active: true });
      await loadTargets();
    } catch (error) {
      setError(error.message || 'Failed to create target');
    }
  };

  const handleToggleActive = async (id, currentState) => {
    try {
      await updateTarget(id, { active: !currentState });
      await loadTargets();
    } catch (error) {
      setError(error.message || 'Failed to update target');
    }
  };

  const handleDeleteTarget = async (id) => {
    if (!window.confirm('Are you sure you want to delete this webhook target?')) {
      return;
    }

    try {
      await deleteTarget(id);
      await loadTargets();
    } catch (error) {
      setError(error.message || 'Failed to delete target');
    }
  };

  const handleTestTarget = async (id) => {
    try {
      const response = await testTarget(id);
      alert(response.message || 'Test webhook sent!');
    } catch (error) {
      alert(error.message || 'Test failed');
    }
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
          <div>
            <h2>Welcome{userName ? `, ${userName}` : ''}! 👋</h2>
            <p className="user-email">{userEmail}</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="add-target-button">
            + Add Webhook Target
          </button>
        </header>

        {error && (
          <div className="error-banner">
            {error}
            <button onClick={() => setError('')}>×</button>
          </div>
        )}

        <div className="dashboard-grid">
          <div className="dashboard-card card-webhooks">
            <div className="card-icon">📡</div>
            <h3>Active Webhooks</h3>
            <p className="card-number">{targets.filter(t => t.active).length}</p>
            <p className="card-description">Active webhook targets</p>
          </div>

          <div className="dashboard-card card-total">
            <div className="card-icon">📋</div>
            <h3>Total Targets</h3>
            <p className="card-number">{targets.length}</p>
            <p className="card-description">Total configured targets</p>
          </div>

          <div className="dashboard-card card-status">
            <div className="card-icon">✅</div>
            <h3>System Status</h3>
            <p className="card-number">Operational</p>
            <p className="card-description">All systems running</p>
          </div>

          <div className="dashboard-card card-uptime">
            <div className="card-icon">⏱️</div>
            <h3>Uptime</h3>
            <p className="card-number">99.9%</p>
            <p className="card-description">Last 30 days</p>
          </div>
        </div>

        <div className="targets-section">
          <h3>Webhook Targets</h3>

          {loading ? (
            <div className="loading">Loading targets...</div>
          ) : targets.length === 0 ? (
            <div className="empty-state">
              <p>No webhook targets configured yet.</p>
              <p>Click "Add Webhook Target" to get started!</p>
            </div>
          ) : (
            <div className="targets-list">
              {targets.map(target => (
                <div key={target.id} className={`target-card ${target.active ? 'active' : 'inactive'}`}>
                  <div className="target-header">
                    <h4>{target.name}</h4>
                    <span className={`status-badge ${target.active ? 'active' : 'inactive'}`}>
                      {target.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="target-url">{target.url}</p>
                  <div className="target-actions">
                    <button
                      onClick={() => handleToggleActive(target.id, target.active)}
                      className="btn-toggle"
                    >
                      {target.active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleTestTarget(target.id)}
                      className="btn-test"
                    >
                      Test
                    </button>
                    <button
                      onClick={() => handleDeleteTarget(target.id)}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Add Webhook Target</h3>
            <form onSubmit={handleAddTarget}>
              <div className="form-group">
                <label>Target Name</label>
                <input
                  type="text"
                  value={newTarget.name}
                  onChange={e => setNewTarget({ ...newTarget, name: e.target.value })}
                  placeholder="My Application"
                  required
                />
              </div>
              <div className="form-group">
                <label>Webhook URL</label>
                <input
                  type="url"
                  value={newTarget.url}
                  onChange={e => setNewTarget({ ...newTarget, url: e.target.value })}
                  placeholder="https://myapp.com/webhook"
                  required
                />
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={newTarget.active}
                    onChange={e => setNewTarget({ ...newTarget, active: e.target.checked })}
                  />
                  Active
                </label>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Add Target
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
