import React from 'react';
import { Link } from 'react-router-dom';
import './Legal.css';

function TermsOfService() {
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
        <h1>Terms of Service</h1>
        <p className="last-updated">Last Updated: {new Date().toLocaleDateString()}</p>

        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using TRFBWebhook ("the Service"), you agree to be bound by these
            Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the Service.
          </p>
        </section>

        <section>
          <h2>2. Description of Service</h2>
          <p>
            TRFBWebhook is a webhook relay platform that receives webhooks from Facebook Messenger
            and Pages and forwards them to your configured target applications. The Service acts as
            a middleware layer between Facebook and your applications.
          </p>
        </section>

        <section>
          <h2>3. Account Registration</h2>
          <p>To use the Service, you must:</p>
          <ul>
            <li>Be at least 13 years of age</li>
            <li>Provide accurate and complete registration information</li>
            <li>Maintain the security of your account credentials</li>
            <li>Promptly update your account information if it changes</li>
            <li>Accept responsibility for all activities under your account</li>
          </ul>
        </section>

        <section>
          <h2>4. Facebook Integration</h2>
          <p>
            By connecting your Facebook account to our Service, you acknowledge that:
          </p>
          <ul>
            <li>You have the necessary permissions to connect your Facebook Pages/Apps</li>
            <li>You comply with Facebook's Platform Terms and Policies</li>
            <li>You are responsible for managing your Facebook access tokens</li>
            <li>You can disconnect your Facebook account at any time</li>
          </ul>
        </section>

        <section>
          <h2>5. Acceptable Use</h2>

          <h3>5.1 You May:</h3>
          <ul>
            <li>Use the Service to relay webhooks to your legitimate applications</li>
            <li>Configure multiple webhook targets</li>
            <li>Test webhook delivery to your targets</li>
            <li>Disconnect and reconnect your Facebook account</li>
          </ul>

          <h3>5.2 You May Not:</h3>
          <ul>
            <li>Use the Service for any illegal or unauthorized purpose</li>
            <li>Violate Facebook's Platform Terms or any applicable laws</li>
            <li>Attempt to gain unauthorized access to the Service</li>
            <li>Interfere with or disrupt the Service or servers</li>
            <li>Use the Service to transmit malware, viruses, or harmful code</li>
            <li>Abuse, harass, or harm other users</li>
            <li>Scrape or harvest data from the Service</li>
            <li>Reverse engineer or attempt to extract source code</li>
          </ul>
        </section>

        <section>
          <h2>6. Privacy and Data</h2>
          <p>
            Your use of the Service is also governed by our <Link to="/privacy">Privacy Policy</Link>.
            Key points include:
          </p>
          <ul>
            <li>We do not store webhook payload content</li>
            <li>We do not store message or conversation data</li>
            <li>Webhooks are forwarded in real-time to your configured targets</li>
            <li>You are responsible for how your target applications use the data</li>
          </ul>
        </section>

        <section>
          <h2>7. Service Availability</h2>
          <p>
            While we strive for high availability, we do not guarantee that:
          </p>
          <ul>
            <li>The Service will be uninterrupted or error-free</li>
            <li>All webhooks will be successfully delivered</li>
            <li>The Service will be available at all times</li>
          </ul>
          <p>
            We reserve the right to modify, suspend, or discontinue the Service at any time
            with or without notice.
          </p>
        </section>

        <section>
          <h2>8. Webhook Delivery</h2>
          <p>
            Regarding webhook forwarding:
          </p>
          <ul>
            <li>We attempt to forward webhooks to your active targets</li>
            <li>We are not responsible for delivery failures due to your target URL issues</li>
            <li>You are responsible for ensuring your target URLs are accessible</li>
            <li>Failed deliveries may not be retried automatically</li>
          </ul>
        </section>

        <section>
          <h2>9. Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality are owned by
            TRFBWebhook and are protected by international copyright, trademark, and other
            intellectual property laws.
          </p>
        </section>

        <section>
          <h2>10. Limitation of Liability</h2>
          <p className="highlight-box">
            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND,
            EITHER EXPRESS OR IMPLIED. TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE
            LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
            INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, OR OTHER INTANGIBLE LOSSES.
          </p>
        </section>

        <section>
          <h2>11. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless TRFBWebhook, its officers, directors, employees,
            and agents from any claims, damages, losses, liabilities, and expenses (including legal fees)
            arising from:
          </p>
          <ul>
            <li>Your use of the Service</li>
            <li>Your violation of these Terms</li>
            <li>Your violation of any third-party rights</li>
            <li>Your violation of Facebook's terms or policies</li>
          </ul>
        </section>

        <section>
          <h2>12. Account Termination</h2>
          <p>
            We reserve the right to terminate or suspend your account at any time for:
          </p>
          <ul>
            <li>Violation of these Terms</li>
            <li>Fraudulent, abusive, or illegal activity</li>
            <li>Extended periods of inactivity</li>
            <li>Any other reason at our sole discretion</li>
          </ul>
          <p>
            You may terminate your account at any time by contacting us or using the account
            deletion feature.
          </p>
        </section>

        <section>
          <h2>13. Third-Party Services</h2>
          <p>
            The Service integrates with Facebook and forwards data to your specified target URLs.
            We are not responsible for:
          </p>
          <ul>
            <li>Facebook's platform changes or downtime</li>
            <li>Your target application's availability or functionality</li>
            <li>Third-party services you integrate with</li>
          </ul>
        </section>

        <section>
          <h2>14. Modifications to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. We will notify users of
            any material changes by posting the new Terms on this page and updating the
            "Last Updated" date. Your continued use of the Service after such changes
            constitutes acceptance of the new Terms.
          </p>
        </section>

        <section>
          <h2>15. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the
            jurisdiction in which TRFBWebhook operates, without regard to its conflict of law provisions.
          </p>
        </section>

        <section>
          <h2>16. Dispute Resolution</h2>
          <p>
            Any disputes arising from these Terms or your use of the Service shall be resolved
            through good faith negotiation. If negotiation fails, disputes shall be resolved
            through binding arbitration.
          </p>
        </section>

        <section>
          <h2>17. Severability</h2>
          <p>
            If any provision of these Terms is found to be unenforceable or invalid, that
            provision shall be limited or eliminated to the minimum extent necessary, and the
            remaining provisions shall remain in full force and effect.
          </p>
        </section>

        <section>
          <h2>18. Entire Agreement</h2>
          <p>
            These Terms, together with our Privacy Policy, constitute the entire agreement
            between you and TRFBWebhook regarding the Service and supersede all prior agreements.
          </p>
        </section>

        <section>
          <h2>19. Contact Information</h2>
          <p>
            If you have any questions about these Terms, please contact us:
          </p>
          <div className="contact-box">
            <p>Email: legal@trfbwebhook.com</p>
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

export default TermsOfService;
