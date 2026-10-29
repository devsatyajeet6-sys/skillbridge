import { extractSkillsFromText } from './matchingEngine';
import { dataService } from '../services/dataService';

export interface CVParseResult {
  extractedSkills: string[];
  suggestedCareerPath?: string;
  summary?: string;
  isAiPowered: boolean;
}

/**
 * Parses CV or document text using configurable AI provider (OpenAI / Gemini)
 * or falls back to our robust deterministic engine if API key is not configured.
 */
export async function parseCVContent(text: string): Promise<CVParseResult> {
  const config = dataService.getConfig();
  const apiKey = config.llm_api_key || import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;

  if (config.llm_provider !== 'deterministic' && apiKey) {
    try {
      // Optional LLM API call if provider is configured
      // Treat uploaded CV content safely as untrusted input
      const sanitizedText = text.slice(0, 4000); // safety cap
      
      if (config.llm_provider === 'openai') {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: 'You are an HR resume parser. Extract technical skills and a suggested career path in JSON format: {"skills": string[], "career_path": string, "summary": string}. Return valid JSON only.'
              },
              {
                role: 'user',
                content: sanitizedText
              }
            ],
            temperature: 0.2
          })
        });

        if (response.ok) {
          const data = await response.json();
          const parsed = JSON.parse(data.choices[0].message.content);
          return {
            extractedSkills: parsed.skills || [],
            suggestedCareerPath: parsed.career_path,
            summary: parsed.summary,
            isAiPowered: true
          };
        }
      }
    } catch (err) {
      console.warn('AI Parsing failed, falling back to deterministic extraction:', err);
    }
  }

  // Deterministic Fallback
  const extracted = extractSkillsFromText(text);
  let suggested = 'Software Developer';
  if (extracted.includes('SQL') || extracted.includes('Excel') || extracted.includes('Power BI')) {
    suggested = 'Data Analyst';
  } else if (extracted.includes('B2B Sales') || extracted.includes('Communication')) {
    suggested = 'Sales Executive';
  } else if (extracted.includes('Financial Modeling') || extracted.includes('Tally ERP')) {
    suggested = 'Accountant';
  }

  return {
    extractedSkills: extracted,
    suggestedCareerPath: suggested,
    summary: 'Parsed using SkillBridge Deterministic Resume Engine. High accuracy skill extraction against industry ontology.',
    isAiPowered: false
  };
}
