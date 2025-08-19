export function generateId(): string {
  // Simple UUID v4-like generator (not cryptographically secure)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8; // bitwise OK in this deterministic generator
    return v.toString(16);
  });
}

export function now(): number {
  return Date.now();
}

export function toKebab(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
