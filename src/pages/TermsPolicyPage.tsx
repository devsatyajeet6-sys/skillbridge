import React from 'react';
import { ShieldCheck, FileText, Lock, Users, Award } from 'lucide-react';

export const TermsPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              Platform Governance
            </span>
            <h1 className="text-3xl font-black text-slate-900 mt-3">
              Terms of Service, Privacy & Refund Policy
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Effective Date: October 2026 • Governing Law: Information Technology Act, 2000 (India)
            </p>
          </div>

          {/* Section 1: Placement Assistance & Refund Terms */}
          <section className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              1. Individual Placement Assistance & Refund Terms
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Enrolment in the SkillBridge Individual Placement Assistance Programme entails a one-time programme assistance fee of ₹5,000 (inclusive of applicable taxes). The programme provides candidate assessment, skill-gap analysis, curriculum roadmaps, and up to 3 direct interview opportunities with verified employer partners over a 6-month validity period.
            </p>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
              <div className="font-semibold text-slate-900">Refund Eligibility Conditions:</div>
              <ul className="list-disc list-inside space-y-1">
                <li>The candidate must attend scheduled interviews in good faith and conduct themselves professionally.</li>
                <li>Upon receiving a verified written job offer and formal selection from a platform partner employer, the candidate is entitled to a conditional refund of ₹2,000.</li>
                <li>The candidate must submit the verified offer letter via the student dashboard. Following administrative validation, the refund is disbursed within 7 working days to the original payment source.</li>
                <li>Attending or scheduling an interview does not automatically constitute verified selection. Selection requires formal hiring confirmation by the employer.</li>
                <li>If the 6-month period lapses without verified placement, the account status updates to "Programme assistance period completed". No punitive labels are ever assigned.</li>
              </ul>
            </div>
          </section>

          {/* Section 2: Privacy, Consent & Minor Protections */}
          <section className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-600" />
              2. Student Privacy, Data Sharing & Guardian Consent
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              We respect candidate privacy and adhere to strict least-privilege principles. Student personal phone numbers, home addresses, and private CV files are never made accessible to public recruiter searches.
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-600">
              <li><strong>Candidate Consent:</strong> Profile information and CV documents are shared with an employer ONLY when the candidate actively applies to a vacancy or explicitly enables "Share Profile with Verified Employers" in their dashboard.</li>
              <li><strong>Protection for Minors (Under 18):</strong> Students under the age of 18 are identified during registration. Verification requires guardian consent, and minor profiles are strictly shielded from unverified inquiries.</li>
              <li><strong>Institutional Boundary:</strong> Participating schools and colleges have access only to their own registered student batches. No institution can inspect another institution’s records.</li>
            </ul>
          </section>

          {/* Section 3: Employer & Skill Centre Terms */}
          <section className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-600" />
              3. Partner Companies & Skill Centre Commercial Terms
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              All partner companies and training providers must submit authentic business credentials. All employer accounts remain in pending status until vetted and authorized by platform administrators.
            </p>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-600">
              <li><strong>Job Moderation:</strong> All vacancies are reviewed to ensure authentic compensation, ethical employment conditions, and accurate required skills.</li>
              <li><strong>Skill Centre Syllabi:</strong> Skill centres are accredited based on verified syllabi, transparent delivery modes (recorded/live/offline), and clear pricing without hidden fees.</li>
              <li><strong>Non-Circumvention:</strong> Employers agree not to solicit candidate contacts outside the platform during active placement assistance phases.</li>
            </ul>
          </section>

          <div className="pt-6 border-t border-slate-100 text-xs text-slate-400 text-center">
            For support inquiries or legal clarifications, contact: <span className="font-semibold text-slate-600">support@skillbridge.in</span>
          </div>

        </div>

      </div>
    </div>
  );
};
