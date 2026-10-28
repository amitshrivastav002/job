export interface Question {
  text: string;
  options: string[];
  answer: number;
}

/** A single playable quiz: one level of one topic. */
export interface Contest {
  id: string;
  title: string;
  questions: Question[];
}

export interface Level {
  id: string;
  name: string;
  questions: Question[];
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  levels: Level[];
}

export const topics: Topic[] = [
  {
    id: 'react',
    title: 'React',
    description: 'From hooks and props to rendering behaviour and performance.',
    levels: [
      {
        id: 'beginner',
        name: 'Beginner',
        questions: [
          {
            text: 'Which hook manages local state in a function component?',
            options: ['useEffect', 'useState', 'useMemo', 'useRef'],
            answer: 1,
          },
          {
            text: 'What does the `key` prop help React do in a list?',
            options: ['Style items', 'Sort items', 'Identify which items changed', 'Encrypt item data'],
            answer: 2,
          },
          {
            text: 'When does useEffect with an empty dependency array run?',
            options: ['On every render', 'Once after the first render', 'Never', 'Only on unmount'],
            answer: 1,
          },
          {
            text: 'Props are…',
            options: ['Mutable state of a component', 'Read-only inputs passed from a parent', 'Global variables', 'CSS classes'],
            answer: 1,
          },
          {
            text: 'Which hook avoids recomputing an expensive value on every render?',
            options: ['useMemo', 'useState', 'useId', 'useContext'],
            answer: 0,
          },
        ],
      },
      {
        id: 'intermediate',
        name: 'Intermediate',
        questions: [
          {
            text: 'What does useCallback return?',
            options: ['A memoized value', 'A memoized function', 'A ref object', 'A promise'],
            answer: 1,
          },
          {
            text: 'Which hook reads the nearest value of a Context?',
            options: ['useReducer', 'useContext', 'useProvider', 'useId'],
            answer: 1,
          },
          {
            text: 'What can trigger a component to re-render?',
            options: [
              'Only a change in its own state',
              'Only a change in props',
              'A state change, a props change, or its parent re-rendering',
              'Only a browser resize',
            ],
            answer: 2,
          },
          {
            text: 'What is useRef best suited for?',
            options: [
              'Triggering a re-render when a value changes',
              'Keeping a mutable value across renders without re-rendering',
              'Fetching data',
              'Replacing props',
            ],
            answer: 1,
          },
          {
            text: 'What makes an input a "controlled" component?',
            options: [
              'It has a CSS class',
              'Its value is driven by React state via value and onChange',
              'It is wrapped in a form',
              'It uses defaultValue only',
            ],
            answer: 1,
          },
        ],
      },
      {
        id: 'advanced',
        name: 'Advanced',
        questions: [
          {
            text: 'Why does React 18 StrictMode run effects an extra time on mount in development?',
            options: [
              'It is a bug in React',
              'To surface effects that are missing cleanup or are not resilient to remounting',
              'To warm up the cache',
              'To speed up the first render',
            ],
            answer: 1,
          },
          {
            text: 'How does useLayoutEffect differ from useEffect?',
            options: [
              'It runs on the server only',
              'It runs synchronously after DOM mutations, before the browser paints',
              'It never runs on updates',
              'It runs before the component renders',
            ],
            answer: 1,
          },
          {
            text: 'What does React.memo do?',
            options: [
              'Caches API responses',
              'Skips re-rendering a component when its props are shallowly equal',
              'Memoizes state updates',
              'Prevents all re-renders permanently',
            ],
            answer: 1,
          },
          {
            text: 'How do you fix the stale value in `setInterval(() => setCount(count + 1), 1000)` inside an effect with `[]` deps?',
            options: [
              'Use setCount(c => c + 1)',
              'Wrap it in try/catch',
              'Call forceUpdate()',
              'Use var instead of const',
            ],
            answer: 0,
          },
          {
            text: 'What does <Suspense> let you do?',
            options: [
              'Catch errors in event handlers',
              'Declaratively show a fallback while lazy code or data is loading',
              'Delay a state update',
              'Run effects in parallel',
            ],
            answer: 1,
          },
        ],
      },
    ],
  },
  {
    id: 'javascript',
    title: 'JavaScript',
    description: 'Core language concepts, from basics to the event loop.',
    levels: [
      {
        id: 'beginner',
        name: 'Beginner',
        questions: [
          {
            text: 'What does `typeof null` return?',
            options: ['"null"', '"undefined"', '"object"', '"number"'],
            answer: 2,
          },
          {
            text: 'Which keyword declares a block-scoped constant?',
            options: ['var', 'let', 'const', 'static'],
            answer: 2,
          },
          {
            text: 'What does `[1, 2, 3].map((x) => x * 2)` return?',
            options: ['[1, 2, 3]', '[2, 4, 6]', '6', 'undefined'],
            answer: 1,
          },
          {
            text: 'What is the difference between `===` and `==`?',
            options: [
              '`===` compares value and type without coercion',
              '`===` is slower and deprecated',
              'They are identical',
              '`==` compares only types',
            ],
            answer: 0,
          },
          {
            text: 'Which method waits for all promises to resolve?',
            options: ['Promise.race', 'Promise.any', 'Promise.all', 'Promise.then'],
            answer: 2,
          },
        ],
      },
      {
        id: 'intermediate',
        name: 'Intermediate',
        questions: [
          {
            text: 'What is a closure?',
            options: [
              'A function that has no parameters',
              'A function bundled with access to variables from its outer scope',
              'A way to close a browser tab',
              'A private class field',
            ],
            answer: 1,
          },
          {
            text: 'How is `this` determined inside an arrow function?',
            options: [
              'By how the function is called',
              'It is always `window`',
              'It is inherited from the enclosing lexical scope',
              'It is always undefined',
            ],
            answer: 2,
          },
          {
            text: 'What does `[] + []` evaluate to?',
            options: ['[]', '0', '"" (an empty string)', 'undefined'],
            answer: 2,
          },
          {
            text: 'Which array method does NOT mutate the original array?',
            options: ['sort', 'splice', 'push', 'slice'],
            answer: 3,
          },
          {
            text: 'After `const a = { x: 1 }; const b = a; b.x = 2;` what is `a.x`?',
            options: ['1', '2', 'undefined', 'It throws an error'],
            answer: 1,
          },
        ],
      },
      {
        id: 'advanced',
        name: 'Advanced',
        questions: [
          {
            text: 'What is the output order of: log(1); setTimeout(() => log(2), 0); Promise.resolve().then(() => log(3)); log(4);',
            options: ['1, 2, 3, 4', '1, 4, 3, 2', '1, 3, 4, 2', '1, 4, 2, 3'],
            answer: 1,
          },
          {
            text: 'What does `console.log(x); var x = 5;` print?',
            options: ['5', 'undefined', 'ReferenceError', 'null'],
            answer: 1,
          },
          {
            text: 'Which creates a new object with a specified prototype?',
            options: ['Object.assign', 'Object.freeze', 'Object.create', 'Object.entries'],
            answer: 2,
          },
          {
            text: 'What does calling `async function f() { return 1 }` return?',
            options: ['1', 'A Promise that resolves to 1', 'undefined', 'A generator'],
            answer: 1,
          },
          {
            text: 'What can be used as keys in a WeakMap?',
            options: [
              'Any primitive value',
              'Strings only',
              'Objects only, held weakly so they can be garbage-collected',
              'Numbers only',
            ],
            answer: 2,
          },
        ],
      },
    ],
  },
  {
    id: 'sql',
    title: 'SQL',
    description: 'Queries, joins and aggregation, up to windows and transactions.',
    levels: [
      {
        id: 'beginner',
        name: 'Beginner',
        questions: [
          {
            text: 'Which clause filters rows before grouping?',
            options: ['HAVING', 'GROUP BY', 'ORDER BY', 'WHERE'],
            answer: 3,
          },
          {
            text: 'Which join returns only rows that match in both tables?',
            options: ['LEFT JOIN', 'INNER JOIN', 'FULL JOIN', 'CROSS JOIN'],
            answer: 1,
          },
          {
            text: 'What does COUNT(*) return?',
            options: ['Sum of a column', 'Number of rows', 'Number of columns', 'Largest value'],
            answer: 1,
          },
          {
            text: 'Which keyword removes duplicate rows from a result?',
            options: ['UNIQUE', 'DISTINCT', 'LIMIT', 'TOP'],
            answer: 1,
          },
          {
            text: 'Which clause filters groups after aggregation?',
            options: ['WHERE', 'FILTER', 'HAVING', 'ON'],
            answer: 2,
          },
        ],
      },
      {
        id: 'intermediate',
        name: 'Intermediate',
        questions: [
          {
            text: 'What does a LEFT JOIN return?',
            options: [
              'Only matching rows',
              'All rows from the left table, with NULLs where the right has no match',
              'All rows from the right table',
              'Only unmatched rows',
            ],
            answer: 1,
          },
          {
            text: 'How do you test for a missing value?',
            options: ['= NULL', '== NULL', 'IS NULL', 'EQUALS NULL'],
            answer: 2,
          },
          {
            text: 'Which clause is logically evaluated first?',
            options: ['SELECT', 'WHERE', 'ORDER BY', 'FROM'],
            answer: 3,
          },
          {
            text: 'How does UNION ALL differ from UNION?',
            options: [
              'UNION ALL keeps duplicate rows',
              'UNION ALL sorts the result',
              'UNION ALL only works on one table',
              'They are identical',
            ],
            answer: 0,
          },
          {
            text: 'What is a primary key?',
            options: [
              'Any indexed column',
              'A column that uniquely identifies each row and cannot be NULL',
              'A foreign reference to another table',
              'The first column of a table',
            ],
            answer: 1,
          },
        ],
      },
      {
        id: 'advanced',
        name: 'Advanced',
        questions: [
          {
            text: 'What does ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC) do?',
            options: [
              'Numbers all rows 1..n across the whole table',
              'Numbers rows within each department by descending salary',
              'Removes duplicate departments',
              'Sums salary per department',
            ],
            answer: 1,
          },
          {
            text: 'What is the main trade-off of adding an index?',
            options: [
              'Faster writes, slower reads',
              'Faster lookups, but slower writes and extra storage',
              'No trade-off',
              'It changes the data type',
            ],
            answer: 1,
          },
          {
            text: 'What does a CTE (WITH clause) provide?',
            options: [
              'A permanent table',
              'A named temporary result set usable within a query',
              'A new database user',
              'A foreign key',
            ],
            answer: 1,
          },
          {
            text: 'In ACID, what does the "I" stand for?',
            options: ['Integrity', 'Isolation', 'Indexing', 'Idempotence'],
            answer: 1,
          },
          {
            text: 'What happens if a `NOT IN (subquery)` subquery returns a NULL?',
            options: [
              'NULLs are ignored',
              'The query returns no rows',
              'It returns all rows',
              'It throws a syntax error',
            ],
            answer: 1,
          },
        ],
      },
    ],
  },
];

export const POINTS_PER_QUESTION = 20;
/** Points needed on a level to unlock the next one. */
export const UNLOCK_SCORE = 60;

export const getResultFeedback = (percent: number) => {
  if (percent === 100)
    return { level: 'Expert', tone: 'green', message: 'Perfect score! You clearly know your stuff — go apply with confidence.' } as const;
  if (percent >= 60)
    return { level: 'Achiever', tone: 'blue', message: 'Great work! A little more practice and you will be at the top of the board.' } as const;
  return { level: 'Learner', tone: 'amber', message: 'Every expert started here. Review the answers below and try again — you will improve fast!' } as const;
};
