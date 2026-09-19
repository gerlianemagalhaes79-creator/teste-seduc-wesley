import React from "react";

interface FormattedMentorTextProps {
  content: string;
  className?: string;
  isMentor?: boolean;
}

// Helper to check if a string starts with an emoji
const startsWithEmoji = (str: string): boolean => {
  const emojiRegex = /^(\p{Emoji_Presentation}|\p{Extended_Pictographic})/u;
  return emojiRegex.test(str.trim());
};

// Clean and humanize LaTeX math expressions
const formatMathSymbols = (expr: string): string => {
  return expr
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1) / ($2)")
    .replace(/\\cdot/g, " · ")
    .replace(/\\times/g, " × ")
    .replace(/\\lambda/g, "λ")
    .replace(/\\Delta/g, "Δ")
    .replace(/\\pi/g, "π")
    .replace(/\\mu/g, "μ")
    .replace(/\\alpha/g, "α")
    .replace(/\\beta/g, "β")
    .replace(/\\gamma/g, "γ")
    .replace(/\\sigma/g, "σ")
    .replace(/\\theta/g, "θ")
    .replace(/\\infty/g, "∞")
    .replace(/\\approx/g, "≈")
    .replace(/\\leq/g, "≤")
    .replace(/\\geq/g, "≥")
    .replace(/\\neq/g, "≠")
    .replace(/\\pm/g, "±")
    .replace(/\\sqrt\{([^}]+)\}/g, "√($1)")
    .replace(/\\rightarrow/g, "→");
};

// Helper to parse inline formatting: **bold**, *bold*, `code`, and $math$
const parseInlineFormatting = (text: string, keyPrefix: string): React.ReactNode[] => {
  if (!text) return [];

  const tokens: React.ReactNode[] = [];
  let remaining = text;
  let keyIndex = 0;

  // Regex to match **bold**, *bold*, `code`, and $math$
  const inlineRegex = /(\$\$([^\$]+)\$\$|\$([^\$]+)\$|\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`)/;

  while (remaining.length > 0) {
    const match = remaining.match(inlineRegex);
    if (!match || match.index === undefined) {
      // Clean any accidental dangling latex commands in regular text
      tokens.push(formatMathSymbols(remaining));
      break;
    }

    const before = remaining.slice(0, match.index);
    if (before) {
      tokens.push(formatMathSymbols(before));
    }

    const fullMatch = match[0];
    const doubleDollarMath = match[2];
    const singleDollarMath = match[3];
    const doubleAsterisk = match[4];
    const singleAsterisk = match[5];
    const codeContent = match[6];

    if (doubleDollarMath !== undefined) {
      tokens.push(
        <span
          key={`${keyPrefix}-blockmath-${keyIndex++}`}
          className="my-1.5 inline-block font-mono text-xs sm:text-sm font-semibold px-2.5 py-1 rounded bg-purple-500/10 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 border border-purple-500/20"
        >
          {formatMathSymbols(doubleDollarMath)}
        </span>
      );
    } else if (singleDollarMath !== undefined) {
      tokens.push(
        <span
          key={`${keyPrefix}-math-${keyIndex++}`}
          className="font-mono text-xs sm:text-sm font-semibold italic text-purple-700 dark:text-purple-300 px-1 py-0.2 rounded bg-purple-500/10 dark:bg-purple-950/40"
        >
          {formatMathSymbols(singleDollarMath)}
        </span>
      );
    } else if (doubleAsterisk !== undefined) {
      tokens.push(
        <strong
          key={`${keyPrefix}-bold-${keyIndex++}`}
          className="font-extrabold text-slate-900 dark:text-white bg-amber-500/10 dark:bg-amber-400/10 px-1 py-0.5 rounded"
        >
          {formatMathSymbols(doubleAsterisk)}
        </strong>
      );
    } else if (singleAsterisk !== undefined) {
      tokens.push(
        <strong
          key={`${keyPrefix}-italicbold-${keyIndex++}`}
          className="font-bold text-slate-900 dark:text-white"
        >
          {formatMathSymbols(singleAsterisk)}
        </strong>
      );
    } else if (codeContent !== undefined) {
      tokens.push(
        <code
          key={`${keyPrefix}-code-${keyIndex++}`}
          className="font-mono text-xs px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-bold"
        >
          {codeContent}
        </code>
      );
    }

    remaining = remaining.slice(match.index + fullMatch.length);
  }

  return tokens;
};

export const FormattedMentorText: React.FC<FormattedMentorTextProps> = ({
  content,
  className = "",
  isMentor = true,
}) => {
  if (!content) return null;

  // Split by line breaks
  const rawLines = content.split("\n");

  return (
    <div className={`space-y-2 leading-relaxed ${className}`}>
      {rawLines.map((line, lineIdx) => {
        const trimmed = line.trim();

        // Empty line -> vertical breathing space
        if (!trimmed) {
          return <div key={`empty-${lineIdx}`} className="h-1.5" />;
        }

        // Isolated Formula / Equation block: $$ ... $$
        const mathBlockMatch = trimmed.match(/^\$\$\s*(.*?)\s*\$\$$/);
        if (mathBlockMatch) {
          const formula = mathBlockMatch[1];
          return (
            <div
              key={`math-block-${lineIdx}`}
              className="my-2.5 p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 text-center font-mono text-sm sm:text-base font-bold text-purple-900 dark:text-purple-100 shadow-sm"
            >
              {formatMathSymbols(formula)}
            </div>
          );
        }

        // Heading detection: Lines starting with #, ##, ###, ####
        const headingMatch = trimmed.match(/^(#{1,6})\s*(.*)$/);
        if (headingMatch) {
          const level = headingMatch[1].length;
          let headingText = headingMatch[2].trim();

          // Check if already has emoji
          const hasEmoji = startsWithEmoji(headingText);
          const prefixEmojiOrArrow = hasEmoji ? "" : level === 1 ? "🏆 " : level === 2 ? "🎯 " : "👉 ";

          // Size hierarchy based on level
          const headingSizeClass =
            level <= 2
              ? "text-base sm:text-lg font-black text-purple-700 dark:text-purple-300 mt-4 mb-2 pb-1 border-b border-purple-500/20"
              : "text-sm sm:text-base font-black text-purple-600 dark:text-purple-300 mt-3 mb-1.5";

          return (
            <div
              key={`heading-${lineIdx}`}
              className={`flex items-start gap-1.5 tracking-tight ${headingSizeClass}`}
            >
              {prefixEmojiOrArrow && (
                <span className="text-purple-500 dark:text-purple-400 shrink-0 select-none">
                  {prefixEmojiOrArrow}
                </span>
              )}
              <span className="flex-1">
                {parseInlineFormatting(headingText, `h-${lineIdx}`)}
              </span>
            </div>
          );
        }

        // Bullet point list item detection (- , * , • )
        const bulletMatch = trimmed.match(/^([-*•])\s+(.*)$/);
        if (bulletMatch) {
          const bulletContent = bulletMatch[2];
          return (
            <div
              key={`bullet-${lineIdx}`}
              className="flex items-start gap-2 text-xs sm:text-sm pl-2 py-0.5"
            >
              <span className="text-purple-500 dark:text-purple-400 font-bold shrink-0 select-none mt-0.5">
                🔹
              </span>
              <div className="flex-1">
                {parseInlineFormatting(bulletContent, `b-${lineIdx}`)}
              </div>
            </div>
          );
        }

        // Numbered list item detection (1. , 2. , etc.)
        const numberedMatch = trimmed.match(/^(\d+[\.\)])\s+(.*)$/);
        if (numberedMatch) {
          const numLabel = numberedMatch[1];
          const numContent = numberedMatch[2];
          return (
            <div
              key={`num-${lineIdx}`}
              className="flex items-start gap-2 text-xs sm:text-sm pl-2 py-0.5"
            >
              <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-700 dark:text-purple-300 font-mono font-bold text-[11px] shrink-0 select-none mt-0.5">
                {numLabel}
              </span>
              <div className="flex-1">
                {parseInlineFormatting(numContent, `n-${lineIdx}`)}
              </div>
            </div>
          );
        }

        // Regular Paragraph / text
        return (
          <p key={`p-${lineIdx}`} className="text-xs sm:text-sm">
            {parseInlineFormatting(line, `p-${lineIdx}`)}
          </p>
        );
      })}
    </div>
  );
};
