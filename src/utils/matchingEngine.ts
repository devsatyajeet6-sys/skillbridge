import type { StudentProfile, Job, Course, SkillMatchResult } from '../types/index.ts';

export const KNOWN_SKILLS_DIRECTORY = [
  'Python', 'SQL', 'Power BI', 'Excel', 'Tableau', 'JavaScript', 'React', 'TypeScript', 
  'Node.js', 'PostgreSQL', 'Git', 'Communication', 'B2B Sales', 'Financial Modeling', 
  'Tally ERP', 'Customer Support', 'Project Management', 'Data Visualisation', 'HTML', 
  'CSS', 'Next.js', 'Machine Learning', 'Statistics', 'DAX', 'REST APIs', 'Java',
  'C++', 'AWS', 'Docker', 'MongoDB', 'Figma', 'Problem Solving', 'Data Structures'
];

/**
 * Deterministic Skill Matching Engine
 * Formula:
 * - Skill Match Weight: 70%
 * - Career Path Alignment: 15%
 * - Education / Readiness Factor: 15%
 */
export function calculateJobMatch(
  student: StudentProfile,
  job: Job,
  allCourses: Course[]
): SkillMatchResult {
  const studentSkills = (student.skills || []).map(s => s.trim().toLowerCase());
  const requiredSkills = (job.required_skills || []).map(s => s.trim().toLowerCase());

  const possessed: string[] = [];
  const missing: string[] = [];

  job.required_skills.forEach(skill => {
    const sLower = skill.trim().toLowerCase();
    if (studentSkills.includes(sLower) || studentSkills.some(st => st.includes(sLower) || sLower.includes(st))) {
      possessed.push(skill);
    } else {
      missing.push(skill);
    }
  });

  // 1. Skill Component (70%)
  const skillRatio = requiredSkills.length > 0 ? possessed.length / requiredSkills.length : 1;
  const skillScore = skillRatio * 70;

  // 2. Career Path Alignment (15%)
  const pathMatch = student.preferred_career_path.toLowerCase() === job.category.toLowerCase() 
    || job.title.toLowerCase().includes(student.preferred_career_path.toLowerCase())
    || student.preferred_career_path.toLowerCase().includes(job.category.toLowerCase());
  const pathMatchScore = pathMatch ? 15 : 8;

  // 3. Readiness / Profile Quality Factor (15%)
  const readinessFactor = Math.min(15, Math.round((student.cv_score || 70) * 0.15));

  const totalScore = Math.min(100, Math.round(skillScore + pathMatchScore + readinessFactor));

  // Find recommended courses that teach missing skills
  const recommendedCourses: Course[] = [];
  if (missing.length > 0) {
    const missingLower = missing.map(m => m.toLowerCase());
    allCourses.forEach(course => {
      if (course.moderation_status === 'approved') {
        const matchesMissing = course.skills_taught.some(st => 
          missingLower.includes(st.toLowerCase()) || missingLower.some(m => m.includes(st.toLowerCase()))
        );
        if (matchesMissing && !recommendedCourses.some(rc => rc.id === course.id)) {
          recommendedCourses.push(course);
        }
      }
    });
  }

  // Transparent explanation string
  const explanation = `Job Match Score (${totalScore}%) is computed from: Skills Match (${possessed.length}/${requiredSkills.length} required skills = ${Math.round(skillScore)}%), Career Path Alignment (${pathMatchScore}%), and Verified Profile Readiness (${readinessFactor}%). Recruiters review all candidates regardless of algorithmic ranking.`;

  return {
    job,
    matchScore: totalScore,
    possessedSkills: possessed,
    missingSkills: missing,
    recommendedCourses,
    eligibilityMet: possessed.length >= Math.ceil(requiredSkills.length * 0.5),
    explanation
  };
}

/**
 * CV Completeness & Job-Readiness Scorer (0-100)
 */
export function calculateCVScore(student: Partial<StudentProfile>): {
  score: number;
  breakdown: { label: string; score: number; max: number; tip: string }[];
} {
  const breakdown: { label: string; score: number; max: number; tip: string }[] = [];

  // 1. Contact & Identity (15 pts)
  let contactScore = 0;
  if (student.full_name) contactScore += 5;
  if (student.email) contactScore += 5;
  if (student.phone) contactScore += 5;
  breakdown.push({
    label: 'Contact & Verification',
    score: contactScore,
    max: 15,
    tip: contactScore < 15 ? 'Provide complete contact phone number and institutional email.' : 'Contact information is complete.'
  });

  // 2. Verified Skills Portfolio (25 pts)
  const skillsCount = student.skills?.length || 0;
  const skillsScore = Math.min(25, skillsCount * 5);
  breakdown.push({
    label: 'Technical Skills Portfolio',
    score: skillsScore,
    max: 25,
    tip: skillsCount < 5 ? `Add at least ${5 - skillsCount} more specific industry skill tags.` : 'Solid skill diversity across technical areas.'
  });

  // 3. Academic & Educational Profile (20 pts)
  let eduScore = 0;
  if (student.education_level) eduScore += 8;
  if (student.institution_name) eduScore += 7;
  if (student.graduation_year) eduScore += 5;
  breakdown.push({
    label: 'Education & Academic History',
    score: eduScore,
    max: 20,
    tip: eduScore < 20 ? 'Specify your exact degree level, college name, and passing year.' : 'Academic credentials fully documented.'
  });

  // 4. Bio & Professional Pitch (20 pts)
  const bioLength = student.bio?.length || 0;
  const bioScore = bioLength > 80 ? 20 : bioLength > 30 ? 12 : 5;
  breakdown.push({
    label: 'Professional Bio & Career Objective',
    score: bioScore,
    max: 20,
    tip: bioLength < 80 ? 'Write an introductory bio highlighting your career goals and problem-solving experience.' : 'Engaging career summary provided.'
  });

  // 5. Portfolio Links & Document Upload (20 pts)
  let linkScore = 0;
  if (student.cv_name || student.cv_url) linkScore += 10;
  if (student.github_url || student.linkedin_url || student.portfolio_url) linkScore += 10;
  breakdown.push({
    label: 'CV Document & Portfolio Links',
    score: linkScore,
    max: 20,
    tip: linkScore < 20 ? 'Attach your CV (PDF/DOCX) or connect your GitHub/LinkedIn profile.' : 'CV and professional profiles connected.'
  });

  const total = breakdown.reduce((acc, curr) => acc + curr.score, 0);

  return {
    score: total,
    breakdown
  };
}

/**
 * Deterministic Skill Extractor from Text/CV
 */
export function extractSkillsFromText(text: string): string[] {
  if (!text) return [];
  const found: string[] = [];
  const textLower = ` ${text.toLowerCase().replace(/[^a-z0-9#+.]/g, ' ')} `;

  KNOWN_SKILLS_DIRECTORY.forEach(skill => {
    const sLower = skill.toLowerCase();
    const regex = new RegExp(`\\b${sLower.replace('+', '\\+').replace('.', '\\.')}\\b`, 'i');
    if (regex.test(textLower)) {
      found.push(skill);
    }
  });

  return Array.from(new Set(found));
}
