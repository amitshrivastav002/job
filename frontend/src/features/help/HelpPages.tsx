const card = 'rounded-2xl border border-slate-200 bg-white p-6 shadow-sm';

const tips = [
  { title: 'Complete your profile', text: 'Add a headline, skills and a resume — complete profiles get noticed first.' },
  { title: 'Tailor every application', text: 'Match your resume and cover letter to the skills listed in the job.' },
  { title: 'Apply early', text: 'Recruiters review the first applicants most closely, so check new jobs daily.' },
  { title: 'Practise with contests', text: 'Use the skill contests to find gaps and track your improvement level by level.' },
];

const faqs = [
  { q: 'Is JobPortal free for job seekers?', a: 'Yes. Creating a profile, applying to jobs and taking contests is free.' },
  { q: 'How do I apply for a job?', a: 'Open a job, click Apply, log in as a job seeker and submit your resume.' },
  { q: 'How can I track my applications?', a: 'Open your profile menu and choose My applications to see every status.' },
  { q: 'How are contest levels unlocked?', a: 'Score 60 or more points on a level to unlock the next one.' },
  { q: 'I am a recruiter. How do I post a job?', a: 'Sign up as a recruiter, then use Post a job from your dashboard.' },
];

export const CareerGuidancePage = () => (
  <div className="mx-auto max-w-3xl px-4 py-10">
    <h1 className="text-2xl font-bold text-slate-900">Career guidance</h1>
    <p className="mt-1 text-sm text-slate-600">Simple steps to get hired faster.</p>
    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      {tips.map((t, i) => (
        <div key={t.title} className={card}>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-700">
            {i + 1}
          </span>
          <h2 className="mt-3 font-semibold text-slate-900">{t.title}</h2>
          <p className="mt-1 text-sm text-slate-600">{t.text}</p>
        </div>
      ))}
    </div>
  </div>
);

export const FaqsPage = () => (
  <div className="mx-auto max-w-3xl px-4 py-10">
    <h1 className="text-2xl font-bold text-slate-900">Frequently asked questions</h1>
    <div className="mt-6 flex flex-col gap-3">
      {faqs.map((f) => (
        <details key={f.q} className={card}>
          <summary className="cursor-pointer font-medium text-slate-900">{f.q}</summary>
          <p className="mt-2 text-sm text-slate-600">{f.a}</p>
        </details>
      ))}
    </div>
  </div>
);
