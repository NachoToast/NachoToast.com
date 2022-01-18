/** Converts a number between 0-255 (inclusive) to it's hexadecimal equivalent. */
function colourToHex(colour: number): string {
    const hex = colour.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
}

/** Converts an RGB value to a hexadecimal string. */
export function RGBToHex(red: number, green: number, blue: number): string {
    return '#' + [red, green, blue].map((e) => colourToHex(e)).join('');
}

function hexToRGB(hexString: string): number[] {
    const red = parseInt(hexString.substring(1, 3), 16);
    const green = parseInt(hexString.substring(3, 5), 16);
    const blue = parseInt(hexString.substring(5), 16);
    return [red, green, blue];
}

/** Compares 2 hex values based on colour difference. */
export function colourDifference(colourA: string, colourB: string): number {
    const rgbA = hexToRGB(colourA);
    const rgbB = hexToRGB(colourB);

    let result = 0;
    for (let i = 0; i < 3; i++) {
        result += (rgbA[i] + rgbB[i]) * (rgbA[i] - rgbB[i]);
    }
    return result;
}
