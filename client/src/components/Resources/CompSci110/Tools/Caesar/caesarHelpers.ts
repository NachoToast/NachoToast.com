export const alphabet = 'abcdefghijklmnopqrstuvwxyz';
const vowels = 'aeiou';

/** Offsets a letter by a specified number along the alphabet.
 * @example shiftLetter('a', 1) -> 'z'
 * @example shiftLetter('z', -1) -> 'a'
 */
export function shiftLetter(letter: string, amount: number): string | false {
    if (amount > 26) amount %= 26;
    else if (amount < 0) amount = 26 - (Math.abs(amount) % 26);

    let index = alphabet.indexOf(letter) - amount;
    if (index < 0) index += 26;

    return alphabet[index];
}

/** Estimates how likely this string is to the intended answer based on vowel positioning.
 * @returns {number} Non-standardized confidence
 */
export function estimateLikelihood(inputString: string): number {
    const inputLower = inputString.toLowerCase();

    let confidence = 0;
    for (let i = 1, len = inputString.length - 1; i < len; i++) {
        const char = inputLower[i];
        const prevChar = inputLower[i - 1];
        const nextChar = inputLower[i + 1];

        if (alphabet.indexOf(char) === -1) continue;
        if (alphabet.indexOf(prevChar) === -1) continue;
        if (alphabet.indexOf(nextChar) === -1) continue;

        const afterConsonant = vowels.indexOf(prevChar) === -1;
        const beforeConsonant = vowels.indexOf(nextChar) === -1;

        if (char === ' ') {
            if (afterConsonant) confidence++;
            if (beforeConsonant) confidence++;
            if (!afterConsonant && !beforeConsonant) confidence += 3;
        }

        if (vowels.indexOf(char) !== -1) {
            confidence++;

            if (afterConsonant) confidence++;
            if (beforeConsonant) confidence++;

            // if (afterConsonant && beforeConsonant) confidence += 3;
        }
    }

    return confidence;
}
