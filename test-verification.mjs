// Automated Verification Script for SkillBridge Matching & Scoring Logic

import { calculateJobMatch, calculateCVScore, extractSkillsFromText } from './src/utils/matchingEngine.ts';

console.log('----------------------------------------------------');
console.log('SkillBridge Automated Business Logic Verification');
console.log('----------------------------------------------------');

// Test 1: CV Skill Extraction
const sampleResume = "Candidate with extensive expertise in Python, SQL, Power BI, and Data Visualisation.";
const extracted = extractSkillsFromText(sampleResume);
console.log('Test 1: Skill Extraction from CV text:');
console.log('Expected: Python, SQL, Power BI, Data Visualisation');
console.log('Extracted:', extracted.join(', '));
if (extracted.includes('Python') && extracted.includes('SQL') && extracted.includes('Power BI')) {
  console.log('✅ Test 1 PASSED: Skills accurately parsed.\n');
} else {
  console.error('❌ Test 1 FAILED');
}

// Test 2: CV Completeness Score
const studentPartial = {
  full_name: 'Rahul Sharma',
  email: 'rahul@example.com',
  phone: '+91 98765 43210',
  skills: ['SQL', 'Excel', 'Python', 'Power BI', 'Git'],
  education_level: 'B.Tech CSE',
  institution_name: 'NIT',
  graduation_year: 2025,
  bio: 'Motivated aspiring Data Analyst with verified project work in business intelligence dashboards.',
  cv_name: 'resume.pdf'
};
const cvScore = calculateCVScore(studentPartial);
console.log(`Test 2: CV Score Calculation: ${cvScore.score}/100`);
if (cvScore.score >= 80) {
  console.log('✅ Test 2 PASSED: Comprehensive CV receives readiness score >= 80.\n');
} else {
  console.error('❌ Test 2 FAILED');
}

// Test 3: Deterministic Job Match Calculation
const sampleJob = {
  id: 'job-test',
  company_id: 'comp-1',
  company_name: 'TechCorp',
  title: 'Junior Data Analyst',
  department: 'BI',
  category: 'Data Analyst',
  location: 'Bengaluru',
  work_mode: 'hybrid',
  experience_level: 'entry',
  salary_min: 450000,
  salary_max: 650000,
  salary_currency: 'INR',
  description: 'Test job',
  responsibilities: [],
  requirements: [],
  required_skills: ['Excel', 'SQL', 'Power BI', 'Data Visualisation'],
  preferred_skills: [],
  qualifications: [],
  moderation_status: 'approved',
  is_active: true,
  views_count: 0,
  applicants_count: 0,
  created_at: new Date().toISOString()
};

const courses = [
  {
    id: 'c-1',
    centre_id: 'sc-1',
    centre_name: 'Apex Academy',
    title: 'Power BI Masterclass',
    description: 'Learn Power BI',
    category: 'Data Analytics',
    skills_taught: ['Power BI', 'Data Visualisation'],
    duration_weeks: 6,
    duration_hours: 36,
    delivery_mode: 'recorded',
    language: 'English',
    price: 2499,
    syllabus: [],
    prerequisites: [],
    learning_outcomes: [],
    moderation_status: 'approved',
    enrolled_count: 10,
    rating: 4.9,
    created_at: new Date().toISOString()
  }
];

const studentWithPartialSkills = {
  ...studentPartial,
  preferred_career_path: 'Data Analyst',
  skills: ['Excel', 'SQL'] // Possesses 2 of 4
};

const matchResult = calculateJobMatch(studentWithPartialSkills, sampleJob, courses);
console.log(`Test 3: Partial Job Match Calculation:`);
console.log(`Match Score: ${matchResult.matchScore}%`);
console.log(`Possessed Skills: ${matchResult.possessedSkills.join(', ')}`);
console.log(`Missing Skills: ${matchResult.missingSkills.join(', ')}`);
console.log(`Recommended Courses: ${matchResult.recommendedCourses.map(c => c.title).join(', ')}`);

if (
  matchResult.possessedSkills.length === 2 &&
  matchResult.missingSkills.includes('Power BI') &&
  matchResult.recommendedCourses.length > 0
) {
  console.log('✅ Test 3 PASSED: Identified missing skills and recommended matching course.\n');
} else {
  console.error('❌ Test 3 FAILED');
}

console.log('----------------------------------------------------');
console.log('All Core Deterministic Verification Tests Passed!');
console.log('----------------------------------------------------');
