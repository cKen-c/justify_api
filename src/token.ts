import crypto from "crypto";

export interface TokenData {
  email: string;
  wordsToday: number;
  lastReset: number;
}

// Stockage en mémoire
export const TOKENS: Record<string, TokenData> = {};

export function generateToken(email: string): string {
  const token = crypto.randomBytes(16).toString("hex");
  TOKENS[token] = { email, wordsToday: 0, lastReset: Date.now() };
  return token;
}

export function verifyToken(token: string): TokenData | null {
  return TOKENS[token] || null;
}

export function resetDailyLimit(tokenData: TokenData) {
  const today = new Date().toDateString();
  if (new Date(tokenData.lastReset).toDateString() !== today) {
    tokenData.wordsToday = 0;
    tokenData.lastReset = Date.now();
  }
}
