/** Converts a number between 0-255 (inclusive) to it's hexadecimal equivalent. */
function colourToHex(colour: number): string {
    const hex = colour.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}

/** Converts an RGB value to a hexadecimal string. */
export function RGBToHex(red: number, green: number, blue: number): string {
    return '#' + [red, green, blue].map((e) => colourToHex(e)).join('');
}
