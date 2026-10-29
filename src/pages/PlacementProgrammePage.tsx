import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  CheckCircle2, 
  IndianRupee, 
  Award, 
  Clock, 
  FileCheck, 
  HelpCircle, 
  ArrowRight,
  Briefcase,
  Users,
  Target
} from 'lucide-react';
import { dataService } from '../services/dataService';
import { PaymentModal } from '../components/common/PaymentModal';

export const PlacementProgrammePage: React.FC = () => {
  const navigate = useNavigate();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const currentUser = dataService.getCurrentUser();
  const student = currentUser?.role === 'student' ? dataService.getStudentByUserId(currentUser.id) : null;
  const enrolment = student ? dataService.getProgrammeEnrolmentForStudent(student.id) : null;
  const config = dataService.getConfig();

  const handleEnrolClick = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (currentUser.role !== 'student' || !student) {
      alert('Please switch to a Student account to enrol in the Individual Placement Programme.');
      return;
    }
    if (enrolment) {
      navigate('/student/placement');
      return;
    }
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = () => {
    if (student) {
      dataService.enrolInPlacementProgramme(student, 'sandbox_demo');
      navigate('/student/placement');
    }
  };

  const stages = [
    { title: '1. Skill Audit & Gap Plan', desc: 'Assess existing competencies and formulate personalized upskilling path.' },
    { title: '2. Interview Scheduling', desc: 'Direct corporate interview slots coordinated with verified partner employers.' },
    { title: '3. Interview Attended', desc: 'Formal attendance logged with employer technical feedback recorded.' },
    { title: '4. Selection by Employer', desc: 'Evaluation cleared based on verified skills and domain interview.' },
    { title: '5. Job Offer Issued', desc: 'Written offer letter extended with transparent compensation structure.' },
    { title: '6. Offer Acceptance', desc: 'Candidate formally signs and accepts employment contract.' },
    { title: '7. Placement Verified', desc: 'Placement details validated by SkillBridge and Institution TPO.' },
    { title: '8. Refund Eligibility (₹2,000)', desc: 'Successful selection condition satisfied; refund unlock button active.' },
    { title: '9. Admin Authorization', desc: 'Platform Administrator audits verification logs and authorizes payout.' },
    { title: '10. Refund Disbursement', desc: '₹2,000 disbursed back to candidate’s original payment method.' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Banner */}
        <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden mb-12">
          <div className="max-w-3xl relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold mb-4">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Outcome-Aligned Placement Assurance
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Individual Student Placement Programme
            </h1>
            <p className="mt-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              Bridging graduates directly into industry roles. Pay a structured programme fee of ₹5,000 and receive a conditional refund of ₹2,000 upon verified selection and employment with our partner companies.
            </p>

            {/* Fee Breakdown Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm">
                <span className="text-xs uppercase font-bold text-slate-300 tracking-wider">Programme Enrolment Fee</span>
                <div className="text-3xl font-black text-white mt-1">₹{config.programme_fee.toLocaleString('en-IN')}</div>
                <p className="text-xs text-slate-300 mt-1">Includes skills audit, matching engine, and up to {config.max_interviews} interview opportunities.</p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 backdrop-blur-sm">
                <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">Conditional Refund</span>
                <div className="text-3xl font-black text-emerald-300 mt-1">₹{config.refund_amount.toLocaleString('en-IN')}</div>
                <p className="text-xs text-emerald-200 mt-1">Disbursed upon verified hiring selection by a partner employer.</p>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              {enrolment ? (
                <Link
                  to="/student/placement"
                  className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-600/30 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Enrolled: View Your Placement Status</span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={handleEnrolClick}
                  className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
                >
                  <span>Enrol in Programme (₹{config.programme_fee.toLocaleString('en-IN')})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-400" />
                Valid for {config.assistance_duration_months} Months from enrolment
              </span>
            </div>
          </div>
        </div>

        {/* 10-Stage Pipeline Breakdown */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-sm mb-12">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              Clear & Configurable Criteria
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              The 10-Step Placement & Refund Lifecycle
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Every status is tracked transparently in the platform database with administrator verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stages.map((st, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3.5"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{st.title}</h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Terms & Safeguards */}
        <div className="bg-slate-100 rounded-3xl p-8 border border-slate-200">
          <h3 className="font-bold text-base text-slate-900 mb-3 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-indigo-600" />
            Programme Safeguards & Reattempt Rules
          </h3>
          <ul className="space-y-2 text-xs text-slate-700 leading-relaxed">
            <li>• <strong>Opportunity Limit:</strong> Candidates are provided up to 3 interview opportunities with verified employers during the 6-month validity period.</li>
            <li>• <strong>Post-Interview Skill Feedback:</strong> If an interview does not result in an offer, specific skill gaps are identified with recommended training modules before scheduling the next opportunity.</li>
            <li>• <strong>No Negative Labeling:</strong> If the 6-month assistance period concludes without a verified hiring, the record gracefully updates to "Programme assistance period completed"—candidates are never labeled as failed individuals.</li>
            <li>• <strong>Strict Refund Verification:</strong> Refunds are processed once an official offer letter or employment contract with a partner company is validated by the platform administrator.</li>
          </ul>
        </div>

        {/* Payment Modal */}
        <PaymentModal
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          title="Placement Assistance Enrolment"
          amount={config.programme_fee}
          purpose="placement_programme"
          description="One-time fee with ₹2,000 conditional refund upon verified hiring"
          onSuccess={handlePaymentSuccess}
        />

      </div>
    </div>
  );
};
