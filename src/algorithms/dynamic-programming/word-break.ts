export const wordBreak = (text: string, dictionary: Iterable<string>): string[] | null => {
  const words = new Set(dictionary);
  const maxLength = Math.max(0, ...[...words].map((word) => word.length));
  const previous = new Array<number>(text.length + 1).fill(-1);
  const reachable = new Array<boolean>(text.length + 1).fill(false);
  reachable[0] = true;

  for (let end = 1; end <= text.length; end++) {
    for (let start = Math.max(0, end - maxLength); start < end; start++) {
      if (reachable[start] && words.has(text.slice(start, end))) {
        reachable[end] = true;
        previous[end] = start;
        break;
      }
    }
  }

  if (!reachable[text.length]) return null;

  const parts: string[] = [];
  for (let end = text.length; end > 0; end = previous[end]!) parts.push(text.slice(previous[end]!, end));
  return parts.reverse();
};
