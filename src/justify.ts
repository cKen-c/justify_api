
export function justifyText(text: string, lineLength = 80): string {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let currentLine: string[] = [];

  for (const word of words) {
    const currentLength = currentLine.join(" ").length;
    if (currentLength + word.length + 1 <= lineLength) {
      currentLine.push(word);
    } else {
      lines.push(justifyLine(currentLine, lineLength));
      currentLine = [word];
    }
  }

  if (currentLine.length > 0) lines.push(currentLine.join(" "));
  return lines.join("\n");
}

function justifyLine(words: string[], lineLength: number): string {
  if (words.length === 1) return words[0];
  const totalChars = words.join("").length;
  const totalSpaces = lineLength - totalChars;
  const gaps = words.length - 1;
  const spacesPerGap = Math.floor(totalSpaces / gaps);
  const extraSpaces = totalSpaces % gaps;

  return words
    .map((word, i) => {
      if (i < gaps) {
        const extra = i < extraSpaces ? 1 : 0;
        return word + " ".repeat(spacesPerGap + extra);
      } else {
        return word;
      }
    })
    .join("");
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).length;
}
