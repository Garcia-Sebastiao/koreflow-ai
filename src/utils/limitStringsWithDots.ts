export function limitStringWithDots(text: string, limit: number) {
  if (!text || text.length <= limit) return text;

  return text.slice(0, limit) + "...";
}
