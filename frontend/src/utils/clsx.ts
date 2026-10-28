export const clsx = (...args: Array<string | false | null | undefined>): string =>
  args.filter(Boolean).join(' ');
