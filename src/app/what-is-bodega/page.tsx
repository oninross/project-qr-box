import { CircleCheckBig } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import Breadcrumbs from "@/components/Breadcrumbs";

function WhatIsBodegaComponent() {
  return (
    <main className="mt-8 mb-24 max-w-2xl mx-auto px-6">
      <div className="flex space-between w-full">
        <h1 className="text-4xl mr-auto font-bold mb-6">
          Welcome to Bodega – Your Virtual Storeroom
        </h1>
      </div>

      <Breadcrumbs />

      <section className="mb-8">
        <p className="mb-4">
          Tired of digging through boxes just to find that one thing you know you kept somewhere?
          With Bodega, you’ll never lose track of what’s inside your storage again.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-2">How It Works</h3>
        <ol className="list-decimal list-inside mb-4 space-y-1">
          <li>Snap a photo of an item before you put it in a box.</li>
          <li>Print a unique marker (QR + AR) for the box and stick it on.</li>
          <li>
            Point your phone at the marker anytime &rarr; and see what’s inside without opening the
            box.
          </li>
          <li>
            Find it fast: search on your phone, point at the box, and preview its contents in AR.
          </li>
        </ol>

        <h3 className="text-xl font-semibold mt-8 mb-2">Why You’ll Love It</h3>
        <ul className="list-none mb-4 space-y-2">
          <li>
            <CircleCheckBig className="inline" /> <strong>Find things instantly</strong> – No more
            guessing or sifting.
          </li>
          <li>
            <CircleCheckBig className="inline" /> <strong>Searchable virtual locker</strong> –
            Titles, and descriptions make everything easy to find.
          </li>
          <li>
            <CircleCheckBig className="inline" /> <strong>Organize your world</strong> – From
            collectibles to seasonal storage, keep it all neat and accessible.
          </li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-2">Perfect For</h3>
        <ul className="list-disc list-inside mb-6 space-y-1">
          <li>Collectors (cards, LEGO, memorabilia)</li>
          <li>Home organizers and declutterers</li>
          <li>Hobbyists, crafters, and makers</li>
          <li>Anyone tired of mystery boxes</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-2">Get Started Free</h3>
        <ul className="list-disc list-inside mb-4 space-y-1">
          <li>5 free boxes to set up your first virtual locker</li>
          <li>Upgrade anytime for more storage and pro features</li>
        </ul>

        <p className="mb-4">
          Your stuff deserves better than being forgotten in a box. With Bodega, your storage
          finally makes sense.
        </p>

        <Link
          href="/"
          className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Start your free locker today
        </Link>
      </section>
    </main>
  );
}

export default function PrivacyPolicyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WhatIsBodegaComponent />
    </Suspense>
  );
}
