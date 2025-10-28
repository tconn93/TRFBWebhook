import React from 'react';
import { Link } from 'react-router-dom';
import './Legal.css';

function DataDeletion() {
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
        <h1>Data Deletion Instructions</h1>
        <p className="last-updated">Last Updated: {new Date().toLocaleDateString()}</p>

        <section>
          <h2>How to Request Data Deletion</h2>
          <p>
            If you've used your Facebook account with FB Webhook Pro and would like to delete your data,
            you have multiple options available:
          </p>
        </section>

        <section>
          <h2>Option 1: Delete from Your Account Dashboard</h2>
          <div className="instruction-box">
            <ol>
              <li>Log in to your FB Webhook Pro account at <Link to="/login">fb.tyler.rest/login</Link></li>
              <li>Navigate to your account settings</li>
              <li>Click the "Delete Account" button</li>
              <li>Confirm the deletion when prompted</li>
            </ol>
          </div>
          <p className="note">
            <strong>Note:</strong> This will permanently delete your account and all associated data immediately.
          </p>
        </section>

        <section>
          <h2>Option 2: Request Deletion via Facebook</h2>
          <div className="instruction-box">
            <ol>
              <li>Go to your Facebook Settings & Privacy</li>
              <li>Click on "Settings"</li>
              <li>Navigate to "Apps and Websites"</li>
              <li>Find "FB Webhook Pro" in the list of connected apps</li>
              <li>Click "Remove" next to the app</li>
              <li>Select "Delete your information" when prompted</li>
            </ol>
          </div>
          <p>
            Facebook will send us a deletion request on your behalf, and we will process it within 24 hours.
          </p>
        </section>

        <section>
          <h2>Option 3: Email Request</h2>
          <p>
            You can email us at <code className="email-highlight">privacy@tyler.rest</code> with your:
          </p>
          <ul>
            <li>Account email address, OR</li>
            <li>Facebook User ID</li>
          </ul>
          <p>
            We will verify your identity and process the deletion request within 48 hours.
          </p>
        </section>

        <section>
          <h2>What Data is Deleted</h2>
          <p className="highlight-box">
            When you request account deletion, we permanently remove the following data:
          </p>
          <ul className="deletion-list">
            <li>✓ Your account information (email, name, encrypted password)</li>
            <li>✓ All webhook targets and configurations you've created</li>
            <li>✓ Facebook authentication tokens and User ID</li>
            <li>✓ Connection timestamps and metadata</li>
            <li>✓ All associated settings and preferences</li>
          </ul>
        </section>

        <section>
          <h2>Data Retention and Processing Time</h2>
          <div className="info-box">
            <h3>Immediate Deletion</h3>
            <p>
              Your data is deleted from our production database immediately upon processing the deletion request.
            </p>
          </div>

          <div className="info-box">
            <h3>Backup Retention</h3>
            <p>
              Encrypted database backups may retain your data for up to <strong>30 days</strong> for
              disaster recovery purposes. After this period, the data is permanently purged from all backups.
            </p>
          </div>

          <div className="info-box">
            <h3>Anonymized Logs</h3>
            <p>
              Some anonymized system logs (without personal identifiers) may be retained for up to
              <strong> 90 days</strong> for security monitoring and debugging purposes. These logs
              cannot be linked back to your account or identity.
            </p>
          </div>
        </section>

        <section>
          <h2>Deletion Confirmation</h2>
          <p>
            After processing your deletion request, you will receive:
          </p>
          <ul>
            <li>Email confirmation (if deleted via dashboard or email request)</li>
            <li>Confirmation code and status URL (if deleted via Facebook)</li>
          </ul>
          <p>
            You can verify deletion by attempting to log in - your account will no longer exist.
          </p>
        </section>

        <section>
          <h2>What Happens After Deletion</h2>
          <p className="warning-box">
            <strong>⚠️ Important:</strong> Account deletion is permanent and cannot be undone.
            After deletion:
          </p>
          <ul>
            <li>You will not be able to log in to your account</li>
            <li>All webhook targets will stop receiving forwarded webhooks</li>
            <li>You will need to create a new account to use the service again</li>
            <li>We cannot recover your deleted data</li>
          </ul>
        </section>

        <section>
          <h2>Questions or Issues?</h2>
          <p>
            If you have questions about data deletion, encounter any issues, or need assistance with
            the deletion process, please contact us at:
          </p>
          <p className="contact-info">
            <strong>Email:</strong> <code className="email-highlight">privacy@tyler.rest</code><br />
            <strong>Subject:</strong> Data Deletion Request
          </p>
          <p>
            We typically respond to deletion-related inquiries within 24 hours.
          </p>
        </section>

        <section className="related-links">
          <h2>Related Information</h2>
          <ul>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default DataDeletion;
