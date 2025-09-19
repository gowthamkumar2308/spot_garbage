export async function verifyImageContainsGarbage(params: {
  title: string;
  description: string;
  image?: string;
  wasteType: string;
}): Promise<{ verified: boolean; confidence: number }> {
  // Lightweight deterministic heuristic to emulate ML verification
  const text = (params.title + params.description + params.wasteType).toLowerCase();
  let score = 0;
  for (let i = 0; i < text.length; i++) score = (score * 31 + text.charCodeAt(i)) % 101;
  if (params.image) score = Math.min(100, score + 15);
  const confidence = Math.max(40, score);
  return new Promise((resolve) => setTimeout(() => resolve({ verified: confidence >= 55, confidence }), 500));
}
