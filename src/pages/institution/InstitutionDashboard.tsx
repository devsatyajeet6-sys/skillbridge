import React, { useState, useEffect } from 'react';
import { 
  Building, 
  Users, 
  Upload, 
  Download, 
  Plus, 
  CheckCircle2, 
  Award, 
  TrendingUp, 
  FileText,
  Clock,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { dataService, subscribeToDataChanges } from '../../services/dataService';
import { Institution, Batch, BatchStudentImportItem, StudentProfile } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export const InstitutionDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'batches' | 'import' | 'reports'>('overview');
  
  const currentUser = dataService.getCurrentUser();
  const [institution, setInstitution] = useState<Institution | null>(
    currentUser ? (dataService.getInstitutionByUserId(currentUser.id) || dataService.getAllInstitutions()[0]) : dataService.getAllInstitutions()[0]
  );

  const [batches, setBatches] = useState<Batch[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);

  // Batch Creation
  const [isCreateBatchOpen, setIsCreateBatchOpen] = useState(false);
  const [batchName, setBatchName] = useState('');
  const [batchDept, setBatchDept] = useState('Computer Science & Engineering');
  const [batchYear, setBatchYear] = useState('2024-2025');

  // CSV Import State
  const [selectedBatchId, setSelectedBatchId] = useState<string>('');
  const [csvText, setCsvText] = useState(
    `full_name,email,phone,education_level,department,graduation_year\nAditya Kumar,aditya.kumar@example.com,+91 98111 00001,B.Tech,Computer Science,2025\nSneha Reddy,sneha.reddy@example.com,+91 98111 00002,B.Tech,Computer Science,2025\nRohan Mehta,rohan.mehta@example.com,+91 98111 00003,B.Tech,Computer Science,2025`
  );
  const [importResult, setImportResult] = useState<{ count: number; errors: string[] } | null>(null);

  const refreshData = () => {
    const user = dataService.getCurrentUser();
    const inst = user ? (dataService.getInstitutionByUserId(user.id) || dataService.getAllInstitutions()[0]) : dataService.getAllInstitutions()[0];
    setInstitution(inst);
    if (inst) {
      const bList = dataService.getBatchesForInstitution(inst.id);
      setBatches(bList);
      if (bList.length > 0 && !selectedBatchId) {
        setSelectedBatchId(bList[0].id);
      }
      const stList = dataService.getAllStudents().filter(s => s.institution_id === inst.id || s.institution_name === inst.institution_name);
      setStudents(stList);
    }
  };

  useEffect(() => {
    refreshData();
    const unsub = subscribeToDataChanges(refreshData);
    return unsub;
  }, []);

  if (!institution) {
    return (
      <div className="min-h-screen p-8 text-center bg-slate-50">
        <h2 className="text-xl font-bold text-slate-800">No Institutional Profile Linked</h2>
        <p className="text-xs text-slate-500 mt-2">Please switch persona to "College TPO (Prof. Rao - NIT)".</p>
      </div>
    );
  }

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    dataService.createBatch({
      institution_id: institution.id,
      institution_name: institution.institution_name,
      name: batchName,
      department: batchDept,
      academic_year: batchYear
    });

    setIsCreateBatchOpen(false);
    setBatchName('');
    alert('Academic student batch created!');
  };

  const handleProcessCSV = () => {
    if (!selectedBatchId) {
      alert('Please select a target cohort batch.');
      return;
    }

    const lines = csvText.trim().split('\n');
    if (lines.length <= 1) {
      alert('CSV must contain a header row and at least one student data row.');
      return;
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const items: BatchStudentImportItem[] = [];

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',').map(p => p.trim());
      if (parts.length >= 2) {
        items.push({
          full_name: parts[0] || 'Student',
          email: parts[1],
          phone: parts[2] || '',
          education_level: parts[3] || 'B.Tech',
          department: parts[4] || 'Engineering',
          graduation_year: Number(parts[5]) || 2025
        });
      }
    }

    const res = dataService.importBatchStudents(selectedBatchId, items);
    setImportResult({ count: res.importedCount, errors: res.errors });
    refreshData();
  };

  const downloadCSVTemplate = () => {
    const templateContent = `full_name,email,phone,education_level,department,graduation_year\nSample Student,student@institution.edu.in,+91 98000 00000,B.Tech,Computer Science,2025`;
    const blob = new Blob([templateContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'skillbridge_student_batch_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAggregatedReport = () => {
    const reportData = {
      institution: institution.institution_name,
      total_enrolled: students.length,
      average_readiness_score: Math.round(students.reduce((a, s) => a + s.job_readiness_score, 0) / Math.max(1, students.length)),
      batches_summary: batches.map(b => ({
        batch: b.name,
        registered: b.registered_students,
        assessed: b.assessed_students,
        placed: b.placed_students
      })),
      export_date: new Date().toISOString(),
      privacy_note: 'Aggregated analytics only. Private student contact information and phone records are shielded.'
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${institution.institution_name.replace(/\s+/g, '_')}_placement_report.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalRegistered = batches.reduce((a, b) => a + b.registered_students, 0);
  const totalAssessed = batches.reduce((a, b) => a + b.assessed_students, 0);
  const totalPlaced = batches.reduce((a, b) => a + b.placed_students, 0);

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-700 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-blue-700/20 overflow-hidden shrink-0">
              <Building className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900">{institution.institution_name}</h1>
                <StatusBadge status={institution.verification_status} />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {institution.institution_type.toUpperCase()} • TPO Head: {institution.contact_person} ({institution.institutional_email})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('import')}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2"
            >
              <Upload className="w-4 h-4" /> Bulk CSV Import
            </button>
            <button
              onClick={downloadAggregatedReport}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Export Report
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 mb-8 overflow-x-auto pb-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'overview' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            Cohort Analytics
          </button>
          <button
            onClick={() => setActiveTab('batches')}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'batches' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            Student Batches ({batches.length})
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'import' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            Validated CSV Student Import
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'reports' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            Privacy & Placement Audit
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Registered</span>
                <div className="text-2xl font-black text-slate-900 mt-1">{totalRegistered} Students</div>
                <p className="text-[11px] text-slate-500 mt-0.5">Across {batches.length} active batches</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-slate-400">Skills Audited</span>
                <div className="text-2xl font-black text-indigo-600 mt-1">{totalAssessed} Assessed</div>
                <p className="text-[11px] text-slate-500 mt-0.5">Skill-gap analysis complete</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-slate-400">Verified Placements</span>
                <div className="text-2xl font-black text-emerald-600 mt-1">{totalPlaced} Offers</div>
                <p className="text-[11px] text-slate-500 mt-0.5">Hired by partner employers</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[10px] uppercase font-bold text-slate-400">Placement Rate</span>
                <div className="text-2xl font-black text-amber-500 mt-1">
                  {totalAssessed > 0 ? `${Math.round((totalPlaced / totalAssessed) * 100)}%` : '0%'}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">Institutional conversion</p>
              </div>
            </div>

            {/* Visual Analytics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-900">Cohort Placement & Assessment Funnel</h3>
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded">Interactive Analytics</span>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={batches} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} tickFormatter={(name) => name.split(' ').slice(0, 2).join(' ')} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
                      <Legend wrapperStyle={{ fontSize: '11px' }} />
                      <Bar dataKey="registered_students" name="Enrolled" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="assessed_students" name="Assessed" fill="#0d9488" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="placed_students" name="Placed" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Student Outcome Breakdown</h3>
                  <span className="text-[10px] text-slate-400">Total Enrolled Cohort Distribution</span>
                </div>
                <div className="h-52 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Verified Placed', value: totalPlaced },
                          { name: 'In Assessment', value: Math.max(0, totalAssessed - totalPlaced) },
                          { name: 'Upskilling Required', value: Math.max(0, totalRegistered - totalAssessed) }
                        ]}
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        <Cell fill="#10b981" />
                        <Cell fill="#6366f1" />
                        <Cell fill="#f59e0b" />
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-3 gap-1 text-center text-[10px] text-slate-500 pt-2 border-t border-slate-100">
                  <span className="text-emerald-700 font-bold">Placed ({totalPlaced})</span>
                  <span className="text-indigo-700 font-bold">Audited ({totalAssessed})</span>
                  <span className="text-amber-700 font-bold">Enrolled ({totalRegistered})</span>
                </div>
              </div>
            </div>

            {/* Batches Table Overview */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900">Enrolled Cohort Batches</h3>
                <button
                  onClick={() => setIsCreateBatchOpen(true)}
                  className="text-xs text-indigo-600 font-semibold hover:underline"
                >
                  + Add New Batch
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="p-3">Batch Name</th>
                      <th className="p-3">Department</th>
                      <th className="p-3">Year</th>
                      <th className="p-3">Registered</th>
                      <th className="p-3">Skills Assessed</th>
                      <th className="p-3">Verified Placed</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {batches.map(batch => (
                      <tr key={batch.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-semibold text-slate-900">{batch.name}</td>
                        <td className="p-3 text-slate-600">{batch.department}</td>
                        <td className="p-3 text-slate-500">{batch.academic_year}</td>
                        <td className="p-3 font-bold text-slate-900">{batch.registered_students}</td>
                        <td className="p-3 text-indigo-600 font-semibold">{batch.assessed_students}</td>
                        <td className="p-3 text-emerald-600 font-bold">{batch.placed_students}</td>
                        <td className="p-3">
                          <button
                            onClick={() => {
                              setSelectedBatchId(batch.id);
                              setActiveTab('import');
                            }}
                            className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold rounded hover:bg-indigo-100"
                          >
                            + Import CSV
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BATCHES */}
        {activeTab === 'batches' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Manage Campus Cohorts</h3>
                <p className="text-xs text-slate-500 mt-0.5">Organize student rosters by engineering or degree departments.</p>
              </div>
              <button
                onClick={() => setIsCreateBatchOpen(true)}
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Create Cohort Batch
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {batches.map(batch => (
                <div key={batch.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                        {batch.academic_year}
                      </span>
                      <h4 className="font-bold text-base text-slate-900 mt-1.5">{batch.name}</h4>
                      <div className="text-xs text-slate-500 mt-0.5">{batch.department}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div>
                      <div className="text-lg font-black text-slate-900">{batch.registered_students}</div>
                      <div className="text-[10px] text-slate-400">Enrolled</div>
                    </div>
                    <div>
                      <div className="text-lg font-black text-indigo-600">{batch.assessed_students}</div>
                      <div className="text-[10px] text-slate-400">Assessed</div>
                    </div>
                    <div>
                      <div className="text-lg font-black text-emerald-600">{batch.placed_students}</div>
                      <div className="text-[10px] text-slate-400">Placed</div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-between items-center text-xs">
                    <span className="text-slate-400">Created: {new Date(batch.created_at).toLocaleDateString()}</span>
                    <button
                      onClick={() => {
                        setSelectedBatchId(batch.id);
                        setActiveTab('import');
                      }}
                      className="text-indigo-600 font-bold hover:underline"
                    >
                      Import Students to Batch →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CSV IMPORT */}
        {activeTab === 'import' && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-3xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Validated Bulk Student Import</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Import cohorts via CSV. Each student account is provisioned with default placement readiness checks.
                </p>
              </div>
              <button
                type="button"
                onClick={downloadCSVTemplate}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 self-start"
              >
                <Download className="w-3.5 h-3.5" /> Download CSV Template
              </button>
            </div>

            {importResult && (
              <div className={`p-4 rounded-2xl text-xs ${importResult.errors.length > 0 ? 'bg-amber-50 text-amber-900 border border-amber-200' : 'bg-emerald-50 text-emerald-900 border border-emerald-200'}`}>
                <div className="font-bold">Import Result: Successfully added {importResult.count} students!</div>
                {importResult.errors.length > 0 && (
                  <ul className="mt-2 list-disc list-inside space-y-0.5 text-[11px] text-amber-800">
                    {importResult.errors.map((err, i) => <li key={i}>{err}</li>)}
                  </ul>
                )}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Cohort Batch</label>
                <select
                  value={selectedBatchId}
                  onChange={(e) => setSelectedBatchId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white font-medium"
                >
                  {batches.map(b => (
                    <option key={b.id} value={b.id}>{b.name} ({b.department})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  CSV Student Data (Paste or Edit directly)
                </label>
                <textarea
                  rows={8}
                  value={csvText}
                  onChange={(e) => setCsvText(e.target.value)}
                  className="w-full p-3 font-mono text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-100 text-slate-600 text-[11px] leading-relaxed">
                <strong>Validation Safeguards:</strong> Email addresses are verified for uniqueness. Automatic accounts and student profile baselines are created. Minor students under 18 will have guardian consent requirements flagged.
              </div>

              <button
                type="button"
                onClick={handleProcessCSV}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" /> Process & Import Batch Students
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: PRIVACY & REPORTS */}
        {activeTab === 'reports' && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-3xl mx-auto space-y-6">
            <h3 className="text-xl font-bold text-slate-900">Institutional Governance & Privacy Protection</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              SkillBridge enforces strict multi-tenant authorization boundaries. Colleges can view aggregate skill statistics, cohort readiness scores, and placement counts, but private candidate CV files, personal mobile numbers, and employer interview feedback are shielded by default to protect student privacy.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Authorized Data Scope
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Exportable metrics include: Enrolment counts, average skill scores, training completion rates, and company selection numbers for NBA/NAAC accreditation audits.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" /> Minor Protection Rules
                </span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  For collegiate students under the age of 18, explicit guardian consent is recorded during bulk CSV onboarding before recruiter discovery is enabled.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={downloadAggregatedReport}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Export Authorized Accreditation Report (JSON)
              </button>
            </div>
          </div>
        )}

        {/* MODAL: CREATE BATCH */}
        {isCreateBatchOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-base font-bold text-slate-900">Create Campus Cohort Batch</h3>
                <button onClick={() => setIsCreateBatchOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>

              <form onSubmit={handleCreateBatch} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Batch / Cohort Name</label>
                  <input
                    type="text"
                    required
                    value={batchName}
                    onChange={(e) => setBatchName(e.target.value)}
                    placeholder="e.g. 2025 B.Tech CSE Batch B"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    required
                    value={batchDept}
                    onChange={(e) => setBatchDept(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Academic Year</label>
                  <input
                    type="text"
                    required
                    value={batchYear}
                    onChange={(e) => setBatchYear(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateBatchOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md"
                  >
                    Create Batch
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
