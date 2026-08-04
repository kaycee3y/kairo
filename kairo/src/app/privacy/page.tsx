// src/app/privacy/page.tsx
"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen px-6 py-12">
      <div className="max-w-2xl mx-auto flex flex-col gap-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-[#6B7280] hover:text-[#2D3436] w-fit"
        >
          <ArrowLeft size={18} />
          Back
        </Link>

        <div className="flex flex-col gap-2">
          <h1 className="font-display text-3xl font-bold">Privacy Policy</h1>
          <p className="text-sm text-[#6B7280]">Last updated: August 2026</p>
        </div>

        <div className="flex flex-col gap-6 text-[#2D3436] leading-relaxed">
          <section className="flex flex-col gap-2">
            <h2 className="font-display font-bold text-lg">1. What we store, and where</h2>
            <p className="text-[#6B7280]">
              Kairo doesn&apos;t use accounts, sign-ups, or a server side
              database. Your missions, XP, levels, streaks, and history are
              saved using your browser&apos;s local storage, on your own
              device. We don&apos;t receive or store this information on our
              own servers.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="font-display font-bold text-lg">2. What we send to our AI provider</h2>
            <p className="text-[#6B7280]">
              When you enter a task, or tell Kairo why you&apos;re stuck, that
              text is sent to Groq, Inc., a third-party AI provider, so it can
              generate your step by step plan or a gentler restructured plan.
              This text is processed by Groq to generate a response and is
              subject to Groq&apos;s own privacy practices. Please avoid
              entering sensitive personal information (like health details,
              full names, or addresses) in your task descriptions.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="font-display font-bold text-lg">3. No tracking or analytics</h2>
            <p className="text-[#6B7280]">
              This prototype does not use advertising trackers or
              behavioral-analytics cookies.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="font-display font-bold text-lg">4. Children&apos;s privacy</h2>
            <p className="text-[#6B7280]">
              Kairo is built with students in mind, including some who may be
              under 13. Because we don&apos;t collect names, emails, or other
              identifying information, and all progress data stays on device,
              we don&apos;t knowingly collect personal information from
              children. Parents, guardians, or teachers with questions can
              reach out using the contact details below.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="font-display font-bold text-lg">5. Deleting your data</h2>
            <p className="text-[#6B7280]">
              Since everything is stored locally, you can remove all your
              Kairo data at any time by clearing your browser&apos;s site
              data/local storage for this site.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="font-display font-bold text-lg">6. Changes</h2>
            <p className="text-[#6B7280]">
              As Kairo develops beyond this hackathon prototype, this policy
              may change for example, if accounts or cloud sync are added
              later. We&apos;ll update this page if that happens.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="font-display font-bold text-lg">7. Contact</h2>
            <p className="text-[#6B7280]">
              Questions about this policy or{" "}
              <Link href="/terms" className="text-[#2F6F5E] underline underline-offset-2">
                our Terms
              </Link>
              ? Reach out via the contact info on our GitHub repository.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}