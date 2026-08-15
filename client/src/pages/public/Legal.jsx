import React from 'react';
import SEO from '../../components/common/SEO';

export default function Legal() {
  return (
    <>
      <SEO title="Privacy Policy & Terms of Service" description="Read Hope Somalia Foundation's official donor privacy policies, data protection guidelines, and terms of service." />

      <section className="bg-navy-950 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold">Privacy Policy & Terms of Service</h1>
          <p className="text-slate-400 text-xs">Last Updated: August 2026</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8 text-slate-700 text-sm leading-relaxed">
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-navy-900">1. Donor Data Safeguarding</h2>
            <p>
              Hope Somalia Foundation is committed to protecting your privacy. We collect personal information strictly to process donations, issue tax receipts, and communicate impact reports. We never sell, trade, or rent donor contact information to third parties.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-navy-900">2. Financial Integrity & Reporting</h2>
            <p>
              All donations received are audited independently by certified public accounting firms. Financial disclosures and annual impact reports are made publicly accessible on our website.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-navy-900">3. Child Protection Policy</h2>
            <p>
              All staff, volunteers, and contractors adhere strictly to our mandatory Child Safeguarding Policy. Photography and beneficiary stories are published only with informed parental consent and respect for personal dignity.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
