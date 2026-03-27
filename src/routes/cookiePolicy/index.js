import React from "react";
import styles from "./cookiePolicy.module.scss";
import CookiePolicyBanner from "./cookiePolicyBanner";

export default function CookiePolicy() {
  return (
    <div>
      <CookiePolicyBanner />
      <div>
        <div className="container">
          <div className={styles.cookiePolicyContent}>
            <h2>1. What Are Cookies?</h2>
            <p>
              Cookies are small text files that are stored on your device (computer, tablet or mobile) when you visit a website. They help websites
              remember your preferences, keep you logged in and understand how you use the platform. Cookies do not contain any personally
              identifiable information unless you have provided it to us.
            </p>

            <h2>2. How Glamolic AI Uses Cookies</h2>
            <p>Glamolic AI uses cookies to:</p>
            <ul>
              <li>Keep you securely logged into your account</li>
              <li>Remember your preferences and settings</li>
              <li>Analyze how users interact with our platform to improve performance</li>
              <li>Understand which features are most used and optimize them</li>
              <li>Ensure the platform loads correctly and functions as expected</li>
              <li>Prevent fraudulent activity and maintain platform security</li>
            </ul>

            <h2>3. Types of Cookies We Use</h2>
            <h3>3.1 Essential Cookies</h3>
            <p>
              These cookies are strictly necessary for the platform to function. Without them, core features like login, account access and credit
              usage will not work properly.
            </p>
            <ul>
              <li>
                <strong>Session cookies</strong>: keep you logged in during your visit
              </li>
              <li>
                <strong>Security cookies</strong>: protect your account from unauthorized access
              </li>
              <li>
                <strong>Preference cookies</strong>: remember your language and display settings
              </li>
            </ul>

            <h3>3.2 Analytics &amp; Performance Cookies</h3>
            <p>These cookies help us understand how visitors use Glamolic AI so we can improve the platform experience.</p>
            <ul>
              <li>Track which pages are visited most frequently</li>
              <li>Measure platform load times and performance</li>
              <li>Identify errors or issues users encounter</li>
              <li>Help us understand user flow and improve navigation</li>
            </ul>

            <h3>3.3 Functional Cookies</h3>
            <p>These cookies enable enhanced functionality and personalization on our platform.</p>
            <ul>
              <li>Remember your last selected settings (model type, background, resolution)</li>
              <li>Save your preferences for future sessions</li>
              <li>Improve your overall experience by reducing repeated setup steps</li>
            </ul>

            <h3>3.4 Third-Party Cookies</h3>
            <p>We may use trusted third-party services that set their own cookies. These include:</p>
            <ul>
              <li>Google Analytics: to analyze platform usage and performance</li>
              <li>Payment Processors: to securely handle credit purchases</li>
              <li>Customer Support Tools: to manage support chat and inquiries</li>
            </ul>
            <p>These third-party services have their own privacy and cookie policies which we encourage you to review.</p>

            <h2>4. Cookies We Do NOT Use</h2>
            <p>Glamolic AI does not use:</p>
            <ul>
              <li>Advertising or retargeting cookies to track you across other websites</li>
              <li>Cookies to sell your data to third-party advertisers</li>
              <li>Any tracking cookies unrelated to delivering our core service</li>
            </ul>

            <h2>5. Cookie Duration</h2>
            <p>Cookies used by Glamolic AI fall into two categories based on how long they remain on your device:</p>
            <ul>
              <li>
                <strong>Session Cookies</strong>: these are temporary and are deleted automatically when you close your browser
              </li>
              <li>
                <strong>Persistent Cookies</strong>: these remain on your device for a set period (typically 30 to 365 days) or until you
                manually delete them. They help us remember you on your next visit.
              </li>
            </ul>

            <h2>6. How to Control &amp; Manage Cookies</h2>
            <p>
              You have full control over cookies. You can manage or disable cookies at any time through your browser settings. Here is how to do
              it in popular browsers:
            </p>
            <ul>
              <li>
                <strong>Google Chrome</strong>: Settings → Privacy and Security → Cookies and other site data
              </li>
              <li>
                <strong>Mozilla Firefox</strong>: Settings → Privacy &amp; Security → Cookies and Site Data
              </li>
              <li>
                <strong>Safari</strong>: Preferences → Privacy → Manage Website Data
              </li>
              <li>
                <strong>Microsoft Edge</strong>: Settings → Cookies and Site Permissions → Cookies and Site Data
              </li>
            </ul>
            <p>
              Please note: Disabling essential cookies may affect the functionality of Glamolic AI. Some features such as login, account access
              and AI generation may not work correctly if essential cookies are blocked.
            </p>

            <h2>7. Cookie Consent</h2>
            <p>
              When you first visit Glamolic AI, you will see a cookie consent banner. By clicking &quot;Accept All Cookies&quot; you consent to
              our use of all cookies described in this policy. You may also choose &quot;Manage Preferences&quot; to customize which types of
              cookies you allow. You can withdraw or update your consent at any time by adjusting your browser settings or contacting us.
            </p>

            <h2>8. Updates to This Cookie Policy</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect changes in technology, law or our platform. When we make significant
              changes, we will update the &quot;Last Updated&quot; date at the top of this page and notify you where appropriate. We encourage
              you to review this policy periodically.
            </p>

            <h2>9. Contact Us</h2>
            <p>If you have any questions about our use of cookies or this Cookie Policy, please contact us:</p>
            <ul>
              <li>
                <strong>Email:</strong> support@glamolic.com
              </li>
              <li>
                <strong>Website:</strong> www.glamolic.com
              </li>
              <li>
                <strong>Support:</strong> Available via the Contact Us page on our platform
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
