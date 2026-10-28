import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { clsx } from '@/utils/clsx';
import { topics, getResultFeedback, POINTS_PER_QUESTION, UNLOCK_SCORE, type Contest } from './contests';

const STORAGE_KEY = 'contest-best-scores';
const card = 'rounded-2xl border border-slate-200 bg-white p-6 shadow-sm';

const loadBest = (): Record<string, number> => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
  } catch {
    return {};
  }
};

const saveBest = (id: string, score: number) => {
  try {
    const best = loadBest();
    if (score > (best[id] ?? -1)) localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...best, [id]: score }));
  } catch {
    /* storage unavailable — score just isn't remembered */
  }
};

const Quiz = ({ contest, onExit }: { contest: Contest; onExit: () => void }) => {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const total = contest.questions.length;

  if (answers.length === total) {
    const correct = answers.filter((a, i) => a === contest.questions[i].answer).length;
    const score = correct * POINTS_PER_QUESTION;
    const feedback = getResultFeedback((correct / total) * 100);

    return (
      <div className="mx-auto max-w-2xl">
        <div className={clsx(card, 'text-center')}>
          <Badge tone={feedback.tone}>{feedback.level}</Badge>
          <p className="mt-4 text-5xl font-bold text-slate-900">
            {score}
            <span className="text-2xl text-slate-400"> / {total * POINTS_PER_QUESTION}</span>
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {correct} of {total} correct
          </p>
          <p className="mx-auto mt-4 max-w-md text-slate-700">{feedback.message}</p>
          <div className="mt-6 flex justify-center gap-3">
            <Button
              onClick={() => {
                setIndex(0);
                setPicked(null);
                setAnswers([]);
              }}
            >
              Try again
            </Button>
            <Button variant="secondary" onClick={onExit}>
              All contests
            </Button>
          </div>
        </div>

        <h2 className="mt-8 font-semibold text-slate-900">Review your answers</h2>
        <div className="mt-3 flex flex-col gap-3">
          {contest.questions.map((q, i) => {
            const ok = answers[i] === q.answer;
            return (
              <div key={q.text} className={card}>
                <p className="text-sm font-medium text-slate-900">
                  {i + 1}. {q.text}
                </p>
                <p className={clsx('mt-2 text-sm', ok ? 'text-green-700' : 'text-red-600')}>
                  Your answer: {q.options[answers[i]]} {ok ? '✓' : '✗'}
                </p>
                {!ok && <p className="text-sm text-green-700">Correct answer: {q.options[q.answer]}</p>}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const q = contest.questions[index];
  const submit = () => {
    if (picked === null) return;
    const next = [...answers, picked];
    setAnswers(next);
    setPicked(null);
    if (next.length === total) {
      const correct = next.filter((a, i) => a === contest.questions[i].answer).length;
      saveBest(contest.id, correct * POINTS_PER_QUESTION);
    } else {
      setIndex(index + 1);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between text-sm text-slate-600">
        <button onClick={onExit} className="hover:text-slate-900">
          ← Exit
        </button>
        <span>
          Question {index + 1} of {total}
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full bg-brand-600 transition-all" style={{ width: `${(index / total) * 100}%` }} />
      </div>

      <div className={clsx(card, 'mt-6')}>
        <h2 className="text-lg font-semibold text-slate-900">{q.text}</h2>
        <div className="mt-4 flex flex-col gap-3">
          {q.options.map((opt, i) => (
            <button
              key={opt}
              onClick={() => setPicked(i)}
              className={clsx(
                'rounded-xl border px-4 py-3 text-left text-sm transition-colors',
                picked === i
                  ? 'border-brand-600 bg-brand-50 font-medium text-brand-800'
                  : 'border-slate-200 text-slate-700 hover:border-brand-300 hover:bg-slate-50',
              )}
            >
              {opt}
            </button>
          ))}
        </div>
        <Button className="mt-6 w-full" disabled={picked === null} onClick={submit}>
          {index + 1 === total ? 'Finish' : 'Next question'}
        </Button>
      </div>
    </div>
  );
};

export const ContestsPage = () => {
  const [active, setActive] = useState<Contest | null>(null);
  const [best, setBest] = useState(loadBest);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {active ? (
        <Quiz
          contest={active}
          onExit={() => {
            setBest(loadBest());
            setActive(null);
          }}
        />
      ) : (
        <>
          <div className="rounded-2xl bg-gradient-to-r from-brand-800 to-brand-600 px-6 py-8 text-white shadow-sm">
            <h1 className="text-2xl font-bold tracking-tight">Skill contests</h1>
            <p className="mt-1 max-w-xl text-sm text-brand-100">
              Test your skills, earn a score and keep improving. Small daily practice beats cramming — beat your
              own best score every time.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {topics.map((t) => (
              <div key={t.id} className={card}>
                <h2 className="text-lg font-semibold text-slate-900">{t.title}</h2>
                <p className="mt-1 text-sm text-slate-600">{t.description}</p>
                <div className="mt-5 flex flex-col gap-3">
                  {t.levels.map((l, i) => {
                    const key = `${t.id}:${l.id}`;
                    const prev = i > 0 ? best[`${t.id}:${t.levels[i - 1].id}`] : undefined;
                    const locked = i > 0 && (prev ?? -1) < UNLOCK_SCORE;
                    const max = l.questions.length * POINTS_PER_QUESTION;
                    return (
                      <div
                        key={l.id}
                        className={clsx(
                          'flex items-center justify-between gap-3 rounded-xl border p-3',
                          locked ? 'border-slate-200 bg-slate-50' : 'border-slate-200',
                        )}
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {locked ? '🔒 ' : ''}
                            {l.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {locked
                              ? `Score ${UNLOCK_SCORE}+ on ${t.levels[i - 1].name} to unlock`
                              : best[key] !== undefined
                                ? `Best: ${best[key]} / ${max}`
                                : `${l.questions.length} questions · ${max} points`}
                          </p>
                        </div>
                        <Button
                          variant={best[key] !== undefined ? 'secondary' : 'primary'}
                          disabled={locked}
                          className="px-3 py-1.5"
                          onClick={() => setActive({ id: key, title: `${t.title} · ${l.name}`, questions: l.questions })}
                        >
                          {best[key] !== undefined ? 'Retry' : 'Start'}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-slate-500">
            Ready to put your skills to work?{' '}
            <Link to="/jobs" className="font-medium text-brand-600 hover:underline">
              Browse jobs
            </Link>
          </p>
        </>
      )}
    </div>
  );
};
