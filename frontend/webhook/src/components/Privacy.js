import React from 'react';
import { Link } from 'react-router-dom';
import './Legal.css';

function Privacy() {
  return (
    <div className="legal-container">
      <nav className="legal-nav">
        <Link to="/" className="legal-logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">FB Webhook Pro</span>
        </Link>
        <Link to="/" className="back-home-button">
          Back to Home
        </Link>
      </nav>

      <div className="legal-content">
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last Updated: {new Date().toLocaleDateString()}</p>

        <section>
          <h2>1. Introduction</h2>
          <p>
            Welcome to TRFBWebhook ("we," "our," or "us"). We are committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, and safeguard your information when you use
            our webhook relay service.
          </p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>

          <h3>2.1 Account Information</h3>
          <p>When you register for an account, we collect:</p>
          <ul>
            <li>Email address</li>
            <li>Name</li>
            <li>Password (encrypted with bcrypt)</li>
          </ul>

          <h3>2.2 Facebook OAuth Information</h3>
          <p>When you connect your Facebook account, we collect:</p>
          <ul>
            <li>Facebook User ID</li>
            <li>Facebook Access Token (for API access)</li>
            <li>Token expiration date</li>
          </ul>

          <h3>2.3 Webhook Configuration</h3>
          <p>We store your webhook target configurations including:</p>
          <ul>
            <li>Target name</li>
            <li>Target URL</li>
            <li>Active/inactive status</li>
          </ul>
        </section>

        <section>
          <h2>3. What We DO NOT Store</h2>
          <p className="highlight-box">
            <strong>Privacy First:</strong> We DO NOT store any of the following:
          </p>
          <ul>
            <li>❌ Message content from Facebook webhooks</li>
            <li>❌ User conversation data</li>
            <li>❌ Profile information from Facebook users</li>
            <li>❌ Any personal data from webhook payloads</li>
          </ul>
          <p>
            Webhooks are received, verified, and immediately forwarded to your configured target
            applications. We process them in real-time without storing the payload content.
          </p>
        </section>

        <section>
          <h2>4. How We Use Your Information</h2>
          <p>We use the collected information to:</p>
          <ul>
            <li>Authenticate and authorize your account access</li>
            <li>Connect to Facebook's API on your behalf</li>
            <li>Forward webhooks to your configured target applications</li>
            <li>Maintain and improve our service</li>
            <li>Communicate with you about service updates</li>
          </ul>
        </section>

        <section>
          <h2>5. Data Security</h2>
          <p>We implement industry-standard security measures including:</p>
          <ul>
            <li>Bcrypt password hashing (10 rounds)</li>
            <li>JWT-based authentication with secure tokens</li>
            <li>Encrypted database connections</li>
            <li>HTTPS/TLS encryption for all data in transit</li>
            <li>Facebook webhook signature verification</li>
          </ul>
        </section>

        <section>
          <h2>6. Data Sharing</h2>
          <p>
            We do not sell, trade, or rent your personal information to third parties.
            Webhook payloads are forwarded only to the target URLs you explicitly configure.
          </p>
        </section>

        <section>
          <h2>7. Facebook Integration</h2>
          <p>
            When you connect your Facebook account, we use your access token to receive webhooks
            from your Facebook Pages and applications. We only request the minimum permissions
            necessary:
          </p>
          <ul>
            <li>pages_show_list - To list your pages</li>
            <li>pages_messaging - To receive messages</li>
            <li>pages_manage_metadata - To manage webhook subscriptions</li>
          </ul>
        </section>

        <section>
          <h2>8. Data Retention</h2>
          <p>We retain your information as follows:</p>
          <ul>
            <li><strong>Account Data:</strong> Until you delete your account</li>
            <li><strong>Facebook Connection:</strong> Until you disconnect your Facebook account</li>
            <li><strong>Webhook Configurations:</strong> Until you delete the target</li>
            <li><strong>Webhook Payloads:</strong> Not stored (forwarded immediately)</li>
          </ul>
        </section>

        <section>
          <h2>9. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your account information</li>
            <li>Update or correct your information</li>
            <li>Delete your account and all associated data</li>
            <li>Disconnect your Facebook account at any time</li>
            <li>Export your webhook configuration data</li>
          </ul>
        </section>

        <section>
          <h2>10. Cookies and Tracking</h2>
          <p>
            We use minimal cookies and local storage for authentication purposes only.
            We do not use tracking cookies or third-party analytics.
          </p>
        </section>

        <section>
          <h2>11. Children's Privacy</h2>
          <p>
            Our service is not intended for users under the age of 13. We do not knowingly
            collect personal information from children under 13.
          </p>
        </section>

        <section>
          <h2>12. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any
            changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </p>
        </section>

        <section>
          <h2>13. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <div className="contact-box">
            <p>Email: privacy@trfbwebhook.com</p>
            <p>GitHub: <a href="https://github.com/yourusername/TRFBWebhook/issues" target="_blank" rel="noopener noreferrer">Open an Issue</a></p>
          </div>
        </section>

        <div className="legal-footer">
          <p>
            <Link to="/terms">Terms of Service</Link> |
            <Link to="/privacy"> Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Privacy;
