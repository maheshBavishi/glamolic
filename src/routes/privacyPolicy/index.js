import React from "react";
import styles from "./privacyPolicy.module.scss";
import PrivacyPolicyBanner from "./privacyPolicyBanner";
export default function PrivacyPolicy() {
  return (
    <div>
      <PrivacyPolicyBanner />
      <div>
        <div className="container">
          <div className={styles.privacyPolicyContent}>
            {/* Section 1 */}
            <h2>1. Introduction</h2>
            <p>
              Welcome to Glamolic AI. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard
              your information when you visit or use our platform at glamolic.com. By using Glamolic AI, you agree to the terms described in this
              policy.
            </p>

            {/* Section 2 */}
            <h2>2. Information We Collect</h2>
            <p>We collect only the minimum information necessary to provide our services. Currently, we collect:</p>
            <ul>
              <li>
                <strong>Full Name</strong> — provided during account registration
              </li>
              <li>
                <strong>Email Address</strong> — used for account creation, login and service communications
              </li>
              <li>
                <strong>Device &amp; Usage Data</strong> — browser type, IP address and basic analytics to improve platform performance
              </li>
            </ul>

            {/* Section 3 */}
            <h2>3. How We Use Your Information</h2>
            <p>We use the information collected for the following purposes:</p>
            <ul>
              <li>To create and manage your Glamolic AI account</li>
              <li>To deliver our AI fashion photography and photoshoot generation services</li>
              <li>To send important account notifications, updates and service-related emails</li>
              <li>To improve platform features, user experience and AI model performance</li>
              <li>To respond to customer support inquiries</li>
            </ul>

            {/* Section 4 */}
            <h2>4. How We Store &amp; Protect Your Information</h2>
            <p>
              We take data security seriously. Your personal information is stored on secure servers with industry-standard encryption. We implement
              appropriate technical and organizational measures to prevent unauthorized access, disclosure, alteration or destruction of your data. We
              do not store your password in plain text all passwords are encrypted.
            </p>

            {/* Section 5 */}
            <h2>5. Sharing Your Information</h2>
            <p>
              We do not sell, rent or trade your personal information to third parties. We may share your information only in the following limited
              circumstances:
            </p>
            <ul>
              <li>
                With trusted service providers who assist in operating our platform (e.g., hosting, analytics) under strict confidentiality agreements
              </li>
              <li>When required by law, court order or government authority</li>
              <li>To protect the rights, safety and property of Glamolic AI or its users</li>
            </ul>

            {/* Section 6 */}
            <h2>6. Cookies &amp; Tracking Technologies</h2>
            <p>
              Glamolic AI uses cookies and similar tracking technologies to enhance your experience on our platform. Cookies help us remember your
              preferences, keep you logged in and analyze how our platform is used. You can control cookie settings through your browser at any time.
              Disabling cookies may limit some features of the platform.
            </p>

            {/* Section 7 */}
            <h2>7. Your Rights &amp; Choices</h2>
            <p>You have the following rights regarding your personal information:</p>
            <ul>
              <li>
                <strong>Access</strong> — you can request a copy of the personal data we hold about you
              </li>
              <li>
                <strong>Correction</strong> — you can update or correct your personal information at any time from your account settings
              </li>
              <li>
                <strong>Deletion</strong> — you can request deletion of your account and associated personal data
              </li>
              <li>
                <strong>Opt-out</strong> — you can unsubscribe from marketing emails at any time using the unsubscribe link in any email
              </li>
              <li>
                <strong>Portability</strong> — you can request an export of your personal data in a commonly used format
              </li>
            </ul>

            {/* Section 8 */}
            <h2>8. Data Retention</h2>
            <p>
              We retain your personal information for as long as your account is active or as needed to provide you with our services. If you delete
              your account, we will remove your personal data within 30 days, unless we are legally required to retain it for a longer period.
            </p>

            {/* Section 9 */}
            <h2>9. Children's Privacy</h2>
            <p>
              Glamolic AI is not intended for use by individuals under the age of 13. We do not knowingly collect personal information from children.
              If we become aware that a child under 13 has provided us with personal data, we will take steps to delete such information immediately.
            </p>

            {/* Section 10 */}
            <h2>10. Third-Party Links</h2>
            <p>
              Our platform may contain links to third-party websites or services. Glamolic AI is not responsible for the privacy practices of those
              sites. We encourage you to review the privacy policies of any third-party sites you visit.
            </p>

            {/* Section 11 */}
            <h2>11. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. When we make significant
              changes, we will notify you via email or by displaying a prominent notice on our platform. Your continued use of Glamolic AI after such
              changes constitutes your acceptance of the updated policy.
            </p>

            {/* Section 12 */}
            <h2>12. Contact Us</h2>
            <p>If you have any questions, concerns or requests regarding this Privacy Policy, please contact us:</p>
            <ul>
              <li>
                <strong>Email:</strong> support@glamolic.com{" "}
              </li>
              <li>
                <strong>Website:</strong> www.glamolic.com
              </li>
              <li>
                <strong>Support:</strong> Available via the Contact Us page on our platform
              </li>
            </ul>

            <p>© 2026 Glamolic AI. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
