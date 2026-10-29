import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ShieldCheck, HeartHandshake, FileText, HelpCircle, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Skill<span className="text-indigo-400">Bridge</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Bridging academic learning and employer hiring. SkillBridge empowers students with transparent skill-gap analysis, accredited training partners, and structured placement assistance.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Transparent Placement Guarantee Framework</span>
            </div>
          </div>

          {/* Stakeholders Col */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Stakeholders
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/student" className="hover:text-white transition-colors">Students & Job Seekers</Link>
              </li>
              <li>
                <Link to="/company" className="hover:text-white transition-colors">Partner Employers</Link>
              </li>
              <li>
                <Link to="/skillcentre" className="hover:text-white transition-colors">Skill & Training Centres</Link>
              </li>
              <li>
                <Link to="/institution" className="hover:text-white transition-colors">Schools & Colleges (TPOs)</Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-indigo-400 transition-colors">Administrator Portal</Link>
              </li>
            </ul>
          </div>

          {/* Programmes & Marketplace */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Ecosystem
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/jobs" className="hover:text-white transition-colors">Job Marketplace</Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-white transition-colors">Accredited Courses</Link>
              </li>
              <li>
                <Link to="/placement-programme" className="hover:text-white transition-colors">₹5,000 Placement Scheme</Link>
              </li>
              <li>
                <Link to="/terms-policy" className="hover:text-white transition-colors">Conditional Refund Terms</Link>
              </li>
            </ul>
          </div>

          {/* Trust & Legal */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Trust & Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/terms-policy" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/terms-policy" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Privacy & Consent
                </Link>
              </li>
              <li>
                <Link to="/terms-policy" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <HeartHandshake className="w-3.5 h-3.5" /> ₹2,000 Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-policy" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" /> FAQs & Support
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 SkillBridge Platform. All rights reserved. Demonstrated records are sample entities.</p>
          <div className="flex items-center gap-6">
            <span>Security: AES-256 & Row-Level Security</span>
            <span>Gateway: Sandbox / Razorpay Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
