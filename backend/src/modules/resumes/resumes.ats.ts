import fs from 'fs/promises';
import path from 'path';
import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';
import type { AiAnalysis } from './resumes.ai';

export interface AtsRole {
  title: string;
  description?: string;
  requirements?: string | null;
  skills?: string[];
}

export interface AtsCheck {
  key: string;
  label: string;
  score: number;
  weight: number;
  source: 'rules' | 'ai';
}

export interface AtsResult {
  score: number;
  checks: AtsCheck[];
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
  ai: AiAnalysis | null;
}

const SECTIONS = ['experience', 'education', 'skills', 'summary', 'projects'];
const DEGREE = /\b(bachelor|master|b\.?tech|m\.?tech|b\.?e\b|b\.?sc|m\.?sc|mba|phd|degree|diploma)/i;
const STOPWORDS = new Set(
  'the and for with that this from have will you your are our was were has but not all any can may who job work team role years year experience ability strong good including etc using use new its their they them also more such other into over per must should able'.split(' '),
);

export const extractText = async (filePath: string): Promise<string> => {
  const buffer = await fs.readFile(filePath);
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.pdf') return (await pdfParse(buffer)).text;
  if (ext === '.docx') return (await mammoth.extractRawText({ buffer })).value;
  return '';
};

const termsFrom = (text: string, limit: number) =>
  [...new Set(text.toLowerCase().match(/[a-z][a-z+#.]{2,}/g) ?? [])]
    .filter((w) => !STOPWORDS.has(w))
    .slice(0, limit);

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
const pct = (hit: number, total: number) => (total ? Math.round((hit / total) * 100) : 100);

export const scoreResume = (text: string, role: AtsRole, ai: AiAnalysis | null = null): AtsResult => {
  const lower = text.toLowerCase();
  const suggestions: string[] = [];

  // 1. Keyword matching (required skills + requirements)
  const wanted = [
    ...new Set([...(role.skills ?? []).map((s) => s.toLowerCase()), ...termsFrom(role.requirements ?? '', 25)]),
  ].slice(0, 40);
  const matchedKeywords = wanted.filter((k) => lower.includes(k));
  const missingKeywords = wanted.filter((k) => !lower.includes(k));
  const keywords = pct(matchedKeywords.length, wanted.length);
  if (missingKeywords.length) {
    suggestions.push(`Add missing keywords where truthful: ${missingKeywords.slice(0, 10).join(', ')}.`);
  }

  // 2. Job title matching
  const titleWords = termsFrom(role.title, 10);
  const titleExact = lower.includes(role.title.toLowerCase());
  const title = titleExact ? 100 : pct(titleWords.filter((w) => lower.includes(w)).length, titleWords.length);
  if (!titleExact) suggestions.push(`Mention the target role ("${role.title}") in your headline or summary.`);

  // 3. Experience relevance (job description terms vs resume)
  const descTerms = termsFrom(role.description ?? '', 40);
  const relevance = descTerms.length ? pct(descTerms.filter((w) => lower.includes(w)).length, descTerms.length) : keywords;
  if (relevance < 50) suggestions.push('Describe responsibilities that mirror the job description.');

  // 4. Quantifiable achievements
  const metrics = text.match(/\d+(\.\d+)?\s?(%|x\b|k\b|m\b|\+)|[$₹€£]\s?\d|\b\d{2,}\s+(users|customers|clients|requests|projects|members|engineers)/gi) ?? [];
  const achievements = Math.min(100, Math.round((metrics.length / 5) * 100));
  if (metrics.length < 3) suggestions.push('Add measurable results (e.g. "reduced load time by 40%").');

  // 5. File compatibility is checked by the caller (unreadable files are rejected);
  //    here we only check that a sane amount of text was extracted.
  const words = text.split(/\s+/).filter(Boolean).length;
  const compatibility = words >= 100 ? 100 : pct(words, 100);
  if (words < 100) suggestions.push('Very little text could be read; avoid scanned images and export as a text-based PDF/DOCX.');

  // 6. Formatting (tables / multi-column / text-box artefacts show up as pipes, tabs or wide gaps)
  const lines = text.split('\n').filter((l) => l.trim());
  const messy = lines.filter((l) => /\t|\s{4,}\S|\|/.test(l)).length;
  const formatting = Math.max(0, 100 - Math.round((messy / Math.max(lines.length, 1)) * 200));
  if (formatting < 80) suggestions.push('Avoid tables, multiple columns and text boxes; use a single-column layout.');

  // 7. Missing information (sections, contact, required qualifications)
  const missing: string[] = SECTIONS.filter((s) => !lower.includes(s));
  const hasEmail = /[\w.+-]+@[\w-]+\.[\w.]+/.test(text);
  const hasPhone = /\+?\d[\d\s().-]{8,}\d/.test(text);
  if (!hasEmail) missing.push('email');
  if (!hasPhone) missing.push('phone');
  const reqText = `${role.requirements ?? ''} ${role.description ?? ''}`;
  if (DEGREE.test(reqText) && !DEGREE.test(text)) missing.push('required degree');
  const years = reqText.match(/(\d+)\+?\s*(?:years|yrs)/i);
  if (years && !/\d+\+?\s*(?:years|yrs)|20\d{2}\s*[-–]/i.test(text)) missing.push(`${years[1]}+ years experience`);
  const completeness = pct(SECTIONS.length + 3 - missing.length, SECTIONS.length + 3);
  if (missing.length) suggestions.push(`Missing or unclear: ${missing.join(', ')}.`);

  // With the AI review, judgement-based checks use its scores; keyword match blends literal hits
  // with how well each requirement is actually demonstrated (listing a skill alone only earns partial credit).
  const demonstrated = ai?.requirements.length
    ? Math.round(
        (ai.requirements.reduce((s, r) => s + (r.status === 'met' ? 1 : r.status === 'partial' ? 0.5 : 0), 0) /
          ai.requirements.length) *
          100,
      )
    : null;
  const pick = (rules: number, aiScore?: number) => (aiScore === undefined ? rules : clamp(aiScore));
  const src = (aiScore?: number): 'rules' | 'ai' => (aiScore === undefined ? 'rules' : 'ai');

  const checks: AtsCheck[] = [
    {
      key: 'keywords',
      label: 'Keyword match',
      score: demonstrated === null ? keywords : Math.round((keywords + demonstrated) / 2),
      weight: 30,
      source: demonstrated === null ? 'rules' : 'ai',
    },
    { key: 'title', label: 'Job title match', score: pick(title, ai?.titleAlignment.score), weight: 15, source: src(ai?.titleAlignment.score) },
    { key: 'relevance', label: 'Experience relevance', score: pick(relevance, ai?.experienceRelevance.score), weight: 15, source: src(ai?.experienceRelevance.score) },
    { key: 'achievements', label: 'Quantifiable achievements', score: pick(achievements, ai?.achievements.score), weight: 10, source: src(ai?.achievements.score) },
    { key: 'compatibility', label: 'File compatibility', score: compatibility, weight: 5, source: 'rules' },
    { key: 'formatting', label: 'ATS-friendly formatting', score: formatting, weight: 10, source: 'rules' },
    { key: 'completeness', label: 'Required information', score: Math.max(0, completeness), weight: 15, source: 'rules' },
  ];
  const score = Math.round(checks.reduce((sum, c) => sum + (c.score * c.weight) / 100, 0));

  if (ai) {
    suggestions.unshift(...ai.gaps.map((g) => `Gap: ${g}`));
    if (ai.seniorityFit.level !== 'match') {
      suggestions.push(`Seniority: ${ai.seniorityFit.reason}`);
    }
  }

  return { score, checks, matchedKeywords, missingKeywords, suggestions, ai };
};
