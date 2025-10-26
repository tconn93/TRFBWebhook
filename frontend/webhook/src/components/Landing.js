import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <header className="landing-header">
        <div className="logo">
          <span className="logo-icon">⚡</span>
          <h1>FB Webhook Pro</h1>
        </div>
        <nav className="landing-nav">
          <button onClick={() => navigate('/login')} className="nav-btn login-btn">
            Login
          </button>
          <button onClick={() => navigate('/register')} className="nav-btn register-btn">
            Get Started
          </button>
        </nav>
      </header>

      <section className="hero-section">
        <div className="hero-content">
          <h2 className="hero-title">
            Supercharge Your Facebook Webhooks
          </h2>
          <p className="hero-subtitle">
            Real-time webhook processing made simple, secure, and powerful
          </p>
          <button onClick={() => navigate('/register')} className="cta-button">
            Start Free Today
          </button>
        </div>
        <div className="hero-visual">
          <div className="webhook-animation">
            <div className="webhook-node node-1">📱</div>
            <div className="webhook-connection"></div>
            <div className="webhook-node node-2">⚡</div>
            <div className="webhook-connection"></div>
            <div className="webhook-node node-3">🎯</div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h3 className="features-title">Why Choose FB Webhook Pro?</h3>
        <div className="features-grid">
          <div className="feature-card card-realtime">
            <div className="feature-icon">⚡</div>
            <h4>Real-Time Processing</h4>
            <p>
              Instant webhook delivery and processing. No delays, no queues -
              get your Facebook events as they happen.
            </p>
          </div>

          <div className="feature-card card-integration">
            <div className="feature-icon">🔗</div>
            <h4>Easy Integration</h4>
            <p>
              Set up in minutes with our simple configuration.
              Connect your Facebook app and start receiving webhooks instantly.
            </p>
          </div>

          <div className="feature-card card-security">
            <div className="feature-icon">🔒</div>
            <h4>Security & Reliability</h4>
            <p>
              Enterprise-grade security with request validation.
              99.9% uptime guaranteed for mission-critical webhooks.
            </p>
          </div>

          <div className="feature-card card-privacy">
            <div className="feature-icon">🛡️</div>
            <h4>Privacy First</h4>
            <p>
              We do not store any personal data from your webhooks.
              Your data flows through securely without persistence.
            </p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h3>Ready to Get Started?</h3>
        <p>Join developers who trust FB Webhook Pro for their Facebook integrations</p>
        <button onClick={() => navigate('/register')} className="cta-button-secondary">
          Create Your Account
        </button>
      </section>

      <footer className="landing-footer">
        <p>&copy; 2025 FB Webhook Pro. Built for developers, by developers.</p>
      </footer>
    </div>
  );
}

export default Landing;
