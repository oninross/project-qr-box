import Breadcrumbs from "@/components/Breadcrumbs";

export default function TermsOfService() {
  return (
    <main className="mt-8 mb-24 max-w-2xl mx-auto px-6">
      <div className="flex space-between w-full">
        <h1 className="text-4xl mr-auto font-bold mb-6">Terms of Service</h1>
      </div>

      <Breadcrumbs />

      {/* Terms of Service Section */}
      <section className="mb-8">
        <p className="italic mb-2">Effective Date: 25 September 2025</p>
        <p className="mb-4">
          Welcome to Bodega! By accessing or using our web application, virtual locker, or related
          services (collectively, the “Service”), you agree to these Terms of Service. If you do not
          agree, do not use our Service.
        </p>

        <h2 className="font-semibold mt-6 mb-2">Acceptance of Terms</h2>
        <p className="mb-4">
          By using Bodega, you agree to be legally bound by these Terms, our Privacy Policy, and any
          additional guidelines, rules, or terms posted by Bodega. We may update these Terms from
          time to time. Continued use of the Service after updates constitutes acceptance of the
          revised Terms.
        </p>

        <h2 className="font-semibold mt-6 mb-2">Eligibility</h2>
        <p className="mb-4">
          You must be at least 13 years old to use Bodega. By using the Service, you represent that
          you meet this age requirement.
        </p>

        <h2 className="font-semibold mt-6 mb-2">User Accounts</h2>
        <ul className="list-disc list-inside ml-4 mb-4">
          <li>To access certain features, you may need to create a Bodega account.</li>
          <li>
            You are responsible for maintaining the confidentiality of your login credentials.
          </li>
          <li>You agree to notify Bodega immediately of any unauthorized use of your account.</li>
        </ul>

        <h2 className="font-semibold mt-6 mb-2">User Content</h2>
        <ul className="list-disc list-inside ml-4 mb-4">
          <li>
            <strong>Ownership:</strong> You retain ownership of content you upload (photos, notes,
            item data, etc.).
          </li>
          <li>
            <strong>License to Bodega:</strong> By uploading content, you grant Bodega a
            non-exclusive, worldwide, royalty-free license to store, display, and deliver your
            content for the purpose of providing the Service.
          </li>
          <li>
            <strong>Prohibited Content:</strong> You may not upload content that is illegal,
            offensive, infringing, or otherwise violates applicable laws.
          </li>
        </ul>

        <h2 className="font-semibold mt-6 mb-2">AR &amp; Marker Features</h2>
        <ul className="list-disc list-inside ml-4 mb-4">
          <li>Bodega provides AR overlays and markers to help locate your stored items.</li>
          <li>Markers must be visible to your device’s camera for AR features to work.</li>
          <li>
            Bodega is not responsible for items lost or misplaced due to incorrect usage of AR
            markers or user error.
          </li>
        </ul>

        <h2 className="font-semibold mt-6 mb-2">Subscriptions &amp; Payments</h2>
        <ul className="list-disc list-inside ml-4 mb-4">
          <li>Certain features may require a paid subscription.</li>
          <li>Payments are processed via Stripe or other payment providers.</li>
          <li>
            Your subscription will automatically renew unless canceled before the next billing
            cycle.
          </li>
          <li>Bodega reserves the right to change subscription fees with notice.</li>
        </ul>

        <h2 className="font-semibold mt-6 mb-2">Use of the Service</h2>
        <ul className="list-disc list-inside ml-4 mb-4">
          <li>You agree to use Bodega only for lawful purposes.</li>
          <li>You may not reverse engineer, copy, modify, or interfere with the Service.</li>
          <li>Bodega may suspend or terminate accounts that violate these Terms.</li>
        </ul>

        <h2 className="font-semibold mt-6 mb-2">Limitation of Liability</h2>
        <ul className="list-disc list-inside ml-4 mb-4">
          <li>Bodega is provided “as is” without warranties of any kind.</li>
          <li>
            We are not liable for lost, damaged, or inaccessible data, including photos, markers, or
            pattern files.
          </li>
          <li>
            In no event shall Bodega’s liability exceed the amount paid by you for the Service in
            the past 12 months.
          </li>
        </ul>

        <h2 className="font-semibold mt-6 mb-2">Privacy</h2>
        <p className="mb-4">
          Your use of Bodega is also governed by our Privacy Policy, which explains how we collect,
          store, and use your data.
        </p>

        <h2 className="font-semibold mt-6 mb-2">Termination</h2>
        <p className="mb-4">
          Bodega may terminate or suspend your account at any time for violations of these Terms.
          Upon termination, you will lose access to the Service and content stored within Bodega.
        </p>

        <h2 className="font-semibold mt-6 mb-2">Governing Law</h2>
        <p className="mb-4">
          These Terms are governed by the laws of [Insert Jurisdiction, e.g., State of California,
          USA], without regard to its conflict of law principles.
        </p>

        <h2 className="font-semibold mt-6 mb-2">Contact</h2>
        <p>
          If you have questions about these Terms, please contact us at: <br />
          Email:{" "}
          <a href="mailto:support@bodega.io" className="text-blue-600 underline">
            support@bodega.io
          </a>
        </p>
      </section>
    </main>
  );
}
