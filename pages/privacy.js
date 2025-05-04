import React from "react";
import Center from "@/ComponentsUser/Center";
import Header from "@/ComponentsUser/Header";
import Title from "@/ComponentsUser/Title";
import Footer from "@/ComponentsUser/Footer";
import styled from "styled-components";

const ParagFormatting = styled.div`
  max-width: 800px;
  margin: 0 auto 2rem;
  line-height: 1.8;
  color: #333;
  @media (max-width: 768px) {
    padding: 0 10px;
  }
  h2 {
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    font-size: 1.25rem;
    color: #222;
  }
  ul {
    margin-bottom: 1rem;
    padding-left: 1.25rem;
  }
  p {
    margin-bottom: 1rem;
  }
  address {
    font-style: normal;
    margin-top: 0.5rem;
    line-height: 1.6;
  }
`;

const ParagWriting = styled.p`
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: #333;
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <Center>
        <Title style={{ textAlign: "center", margin: "2rem 0 1rem" }}>
          Privacy Policy
        </Title>
        <ParagFormatting>
          <ParagWriting><strong>Last updated:</strong> {new Date().toLocaleDateString()}</ParagWriting>

          <p>Thank you for choosing DM Touch. We are committed to protecting and respecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.</p>

          <h2>1. Information We Collect</h2>
          <p>We may collect personal information that you voluntarily provide when you register, place an order, or contact us, such as:</p>
          <ul>
            <li>Name, email address, and phone number</li>
            <li>Billing and shipping address</li>
            <li>Payment information (e.g., credit card details) – handled via secure third-party processors</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>To process and fulfill your orders, send order updates, and provide customer support.</li>
            <li>To communicate with you about our products, promotions, and updates (you may opt out at any time).</li>
            <li>To improve our website, products, and services.</li>
          </ul>

          <h2>3. Cookies and Tracking Technologies</h2>
          <p>We use cookies and similar tracking technologies to enhance your experience, analyze site usage, and personalize content. You can manage cookies through your browser settings.</p>

          <h2>4. Data Sharing and Disclosure</h2>
          <p>We do not sell or rent your personal information. We may share information with:</p>
          <ul>
            <li>Service providers who assist with order processing and website maintenance.</li>
            <li>Law enforcement or regulators, if required by law or to protect rights.</li>
          </ul>

          <h2>5. Security</h2>
          <p>We implement reasonable security measures to protect your data. However, no online transmission can be guaranteed 100% secure.</p>

          <h2>6. Your Rights</h2>
          <p>Depending on your jurisdiction, you may have the right to access, correct, or delete your personal information. To exercise these rights, contact us at <a href="mailto:privacy@dmtouch.com">privacy@dmtouch.com</a>.</p>

          <h2>7. Changes to This Policy</h2>
          <p>We may update this policy from time to time. The “Last updated” date at the top will reflect when changes were made.</p>

          <h2>8. Contact Us</h2>
          <p>If you have questions or concerns about this Privacy Policy, please contact us at <a href="mailto:support@dmtouch.com">support@dmtouch.com</a> or:</p>
          <address>
            DM Touch<br />
            Unit B19<br />
            No 49 The Link<br />
            Effra Rd<br />
            London SW2 1BZ
          </address>
        </ParagFormatting>
      </Center>
      <Footer />
    </>
  );
}
