import { TokenData } from "./token";

export function checkQuota(tokenData: TokenData, wordsToAdd: number, limit = 80000): boolean {
  if (tokenData.wordsToday + wordsToAdd > limit) {
    return false;
  }
  tokenData.wordsToday += wordsToAdd;
  return true;
}
