import Breadcrumbs from "@/components/Breadcrumbs";
import UserAvatarMenu from "@/components/UserAvatarMenu";

export default function Help() {
  return (
    <main className="mt-8 mb-24 max-w-2xl mx-auto px-6">
      <div className="flex space-between w-full">
        <h1 className="text-4xl mr-auto font-bold mb-6">Help &amp; FAQ</h1>
        <UserAvatarMenu size={48} />
      </div>

      <Breadcrumbs />

      {/* ...existing FAQ/help content... */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
        <div className="mb-4">
          <h3 className="font-semibold">Q: How do I set up my first box?</h3>
          <ol className="list-decimal list-inside ml-4 mt-2 space-y-1">
            <li>Create a new box and name it (e.g., “Garage Storage” or “Board Games”).</li>
            <li>Upload photos of your items and label them with titles and descriptions.</li>
            <li>Print your unique QR/AR markers and stick them on your boxes.</li>
          </ol>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold">Q: How do I see the items inside my box?</h3>
          <ol className="list-decimal list-inside ml-4 mt-2 space-y-1">
            <li>Find the QR/AR marker of the box.</li>
            <li>Scan the marker using the app or your device’s camera.</li>
          </ol>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold">Q: How do I find an item in a box?</h3>
          <ol className="list-decimal list-inside ml-4 mt-2 space-y-1">
            <li>Open the detail page of the item.</li>
            <li>Tap the green button on the lower right of the screen.</li>
            <li>Select &quot;Find item&quot;.</li>
            <li>
              Point your camera to the QR/AR marker. A green target will appear on the correct box.
            </li>
          </ol>
        </div>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Markers &amp; Boxes</h2>
        <div className="mb-4">
          <h3 className="font-semibold">Q: Are all markers unique?</h3>
          <p>Yes, each QR &amp; AR marker pair is unique and linked to one specific box.</p>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold">Q: Can I re-use a marker?</h3>
          <p>
            No, each marker is tied to a single locker/box. If you delete a box, the marker becomes
            free to use again.
          </p>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold">Q: What if my marker gets damaged?</h3>
          <p>Print a new one from your dashboard and stick it over the old one.</p>
        </div>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Managing Items</h2>
        <div className="mb-4">
          <h3 className="font-semibold">Q: How do I add items to a box?</h3>
          <ol className="list-decimal list-inside ml-4 mt-2 space-y-1">
            <li>Go to your virtual locker.</li>
            <li>Select a box, click “Add Item,” and upload a photo with details.</li>
          </ol>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold">Q: How do I remove items?</h3>
          <ol className="list-decimal list-inside ml-4 mt-2 space-y-1">
            <li>Open the box, select the item, and click “Remove.”</li>
            <li>This also deletes the photo from Firebase storage.</li>
          </ol>
        </div>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">AR Overlay</h2>
        <div className="mb-4">
          <h3 className="font-semibold">Q: Does the AR view work on all devices?</h3>
          <p>Yes, it should work for all modern devices</p>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold">Q: Do I need to install an app?</h3>
          <p>No — AR runs directly in your device&quo;s browser.</p>
        </div>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Account &amp; Billing</h2>
        <div className="mb-4">
          <h3 className="font-semibold">Q: What’s included in the free plan?</h3>
          <p>Up to 5 markers</p>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold">Q: How do I upgrade?</h3>
          <p>
            Go to your profile &gt; Billing and select a plan. (Currently, Free plans are only
            available)
          </p>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold">Q: Can I cancel anytime?</h3>
          <p>
            Yes, subscriptions are monthly. Cancel anytime, and you’ll keep access until the end of
            your billing cycle.
          </p>
        </div>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Troubleshooting</h2>
        <ul className="list-disc list-inside ml-4 space-y-1">
          <li>
            <strong>Marker not scanning?</strong> Make sure it’s printed clearly, with enough light
            for the camera.
          </li>
          <li>
            <strong>AR not showing?</strong> Check browser permissions for camera access.
          </li>
          <li>
            <strong>Photos not deleting?</strong> Refresh your locker. If still stuck, contact
            support.
          </li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Still Need Help?</h2>
        <p>
          Email us at{" "}
          <a href="mailto:support@domain.com" className="text-blue-600 underline">
            support@domain.com
          </a>
        </p>
      </section>
    </main>
  );
}
