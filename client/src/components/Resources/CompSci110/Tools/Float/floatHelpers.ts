const hex = ['A', 'B', 'C', 'D', 'E', 'F'];

/** Converts a binary string nibble to its hexadecimal equivalent. */
export function binaryToHex(binaryNibble: string): string {
    const asInt = parseInt(binaryNibble, 2);
    if (asInt < 10) return asInt.toString();
    return hex[asInt - 10];
}
