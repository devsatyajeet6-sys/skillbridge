-- SkillBridge Seed Data for Development and Demonstration
-- Note: UUIDs and records are formatted for PostgreSQL and matching the frontend mock service

-- 1. Skills Directory
INSERT INTO public.skills (name, category) VALUES
('Python', 'Programming'),
('SQL', 'Database'),
('Power BI', 'Analytics'),
('Excel', 'Analytics'),
('Tableau', 'Analytics'),
('JavaScript', 'Web Development'),
('React', 'Frontend'),
('TypeScript', 'Web Development'),
('Node.js', 'Backend'),
('PostgreSQL', 'Database'),
('Git', 'DevOps'),
('Communication', 'Soft Skills'),
('B2B Sales', 'Sales'),
('Financial Modeling', 'Finance'),
('Tally ERP', 'Finance'),
('Customer Support', 'Operations'),
('Project Management', 'Management'),
('Data Visualisation', 'Analytics')
ON CONFLICT (name) DO NOTHING;

-- Realistic demonstration datasets are initialized in the persistent local data layer
-- and can be loaded directly into PostgreSQL via Supabase Studio or CLI.
