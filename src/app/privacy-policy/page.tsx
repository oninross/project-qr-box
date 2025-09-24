import { Suspense } from "react";

import Breadcrumbs from "@/components/Breadcrumbs";

function PrivacyPolicyComponent() {
  return (
    <main className="mt-8 mb-24 max-w-2xl mx-auto px-6">
      <div className="flex space-between w-full">
        <h1 className="text-4xl mr-auto font-bold mb-6">Privacy Policy</h1>
      </div>

      <Breadcrumbs />

      <section className="mb-8">
        <p className="italic mb-2">Effective Date: 25 September 2025</p>
        <p className="mb-4">
          Bodega (“we,” “our,” or “us”) respects your privacy and is committed to protecting the
          personal information you share with us while using our web application and related
          services (the “Service”). By using Bodega, you agree to the practices described in this
          Privacy Policy.
        </p>

        <h2 className="font-semibold mt-6 mb-2">Information We Collect</h2>
        <ul className="list-disc list-inside ml-4 mb-4">
          <li>
            <strong>User-provided Information:</strong>
            <ul className="list-disc list-inside ml-6">
              <li>Account information: name, email, password</li>
              <li>Content you upload: photos of items, titles, descriptions, tags</li>
              <li>Preferences and settings</li>
            </ul>
          </li>
          <li>
            <strong>Automatically Collected Information:</strong>
            <ul className="list-disc list-inside ml-6">
              <li>Device information: type, operating system, browser</li>
              <li>Usage data: pages visited, interactions with AR features, timestamps</li>
              <li>IP addresses and geolocation (if enabled by device)</li>
            </ul>
          </li>
          <li>
            <strong>AR/Marker Data:</strong>
            <ul className="list-disc list-inside ml-6">
              <li>We generate unique AR/QR markers for your boxes.</li>
              <li>Marker data is associated with your account to enable AR overlays.</li>
              <li>
                Pattern files used for AR overlays are stored in our servers but do not contain
                personally identifiable information.
              </li>
            </ul>
          </li>
        </ul>

        <h2 className="font-semibold mt-6 mb-2">How We Use Your Information</h2>
        <ul className="list-disc list-inside ml-4 mb-4">
          <li>Provide, operate, and maintain the Service</li>
          <li>Display your uploaded photos and AR overlays</li>
          <li>Enable searching, sorting, and locating items in your virtual boxes</li>
          <li>Communicate with you about updates, subscriptions, and support</li>
          <li>Monitor and improve the Service, including troubleshooting and analytics</li>
        </ul>

        <h2 className="font-semibold mt-6 mb-2">How We Share Your Information</h2>
        <ul className="list-disc list-inside ml-4 mb-4">
          <li>
            We do not sell your personal information. We may share your data in limited
            circumstances:
          </li>
          <li>
            <strong>Service Providers:</strong> Payment processors (e.g., Stripe), hosting services
            (Firebase/Vercel)
          </li>
          <li>
            <strong>Legal Requirements:</strong> If required by law or to protect our rights
          </li>
          <li>
            <strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets
          </li>
        </ul>

        <h2 className="font-semibold mt-6 mb-2">Storage and Security</h2>
        <ul className="list-disc list-inside ml-4 mb-4">
          <li>
            Your content, AR markers, and pattern files are stored on secure cloud storage (Firebase
            or Vercel).
          </li>
          <li>
            We implement reasonable technical and administrative safeguards to protect your data.
          </li>
          <li>
            However, no system is completely secure. You are responsible for maintaining your
            account credentials securely.
          </li>
        </ul>

        <h2 className="font-semibold mt-6 mb-2">Your Choices</h2>
        <ul className="list-disc list-inside ml-4 mb-4">
          <li>
            <strong>Account Management:</strong> You can update or delete your account at any time.
            Deleting your account removes all associated content and markers.
          </li>
          <li>
            <strong>Subscriptions:</strong> You can cancel subscriptions anytime; access will
            continue until the end of the billing cycle.
          </li>
          <li>
            <strong>Cookies &amp; Analytics:</strong> You can opt out of cookies or analytics
            tracking via browser settings, but some features may be affected.
          </li>
        </ul>

        <h2 className="font-semibold mt-6 mb-2">Data Retention</h2>
        <p className="mb-4">
          We retain your information as long as your account is active or as needed to provide the
          Service. Photos, markers, and pattern files may be deleted if the account is removed or
          after extended inactivity, in accordance with our storage and lifecycle policies.
        </p>

        <h2 className="font-semibold mt-6 mb-2">Children’s Privacy</h2>
        <p className="mb-4">
          Bodega is not intended for children under 13. We do not knowingly collect information from
          children under 13. If we become aware that we have collected such data, we will delete it
          promptly.
        </p>

        <h2 className="font-semibold mt-6 mb-2">Third-Party Links</h2>
        <p className="mb-4">
          The Service may contain links to third-party websites or services. We are not responsible
          for the privacy practices of those third parties.
        </p>

        <h2 className="font-semibold mt-6 mb-2">Changes to This Privacy Policy</h2>
        <p className="mb-4">
          We may update this Privacy Policy from time to time. Changes will be posted with the
          updated effective date. Continued use of the Service after changes constitutes acceptance.
        </p>

        <h2 className="font-semibold mt-6 mb-2">Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy or your data, contact us at: <br />
          Email:{" "}
          <a href="mailto:support@bodega.io" className="text-blue-600 underline">
            support@bodega.io
          </a>
        </p>
      </section>
    </main>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PrivacyPolicyComponent />
    </Suspense>
  );
}
