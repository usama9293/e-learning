// textUtils.ts
export default function truncateToWords(text: string, wordLimit: number): string {
  if (!text) return '';
  const words = text.split(/\s+/);
  if (words.length <= wordLimit) {
    return text;
  }
  return words.slice(0, wordLimit).join(' ') + '...';
}
