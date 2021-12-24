const alphabet = 'abcdefghijklmnopqrstuvwxyz';

/** Inverts a 2x2 matrix.
 * @example invertMatrix([3, 2, 7, 5]) -> [5, -2, -7, 3]
 */
export function invertMatrix(matrix: number[]): number[] {
    const invertedMatrix = new Array(matrix.length);

    // flip a and d
    invertedMatrix[0] = matrix[3];
    invertedMatrix[3] = matrix[0];

    // neg b and c
    invertedMatrix[1] = -matrix[1];
    invertedMatrix[2] = -matrix[2];

    // divide by determinant (ad - bc)
    const determinant =
        invertedMatrix[0] * invertedMatrix[3] - invertedMatrix[1] * invertedMatrix[2];
    invertedMatrix.forEach((_, i) => {
        invertedMatrix[i] /= determinant;
    });

    return invertedMatrix;
}

/** Turns a string into an array of numbers corresponding to their position in the alphabet.
 * @example encodeString('abc', 0) -> [0, 1, 2]
 * @example encodeString('cde', 1) -> [3, 4, 5]
 */
export function encodeString(inputString: string, index: number = 0): number[] {
    const encodedString = new Array(inputString.length);

    for (let i = 0, len = inputString.length; i < len; i++) {
        encodedString[i] = alphabet.indexOf(inputString[i]) + index;
    }

    return encodedString;
}

/** Turns an array of numbers into a string based on alphabetical index.
 * @example decodeString([0, 1, 2], 0) -> 'abc'
 * @example decodeString([3, 4, 5], 1) -> 'cde'
 */
export function decodeString(inputArray: number[], index: number = 0): string {
    let decodedString = '';

    for (const num of inputArray) {
        const letterAtIndex = alphabet[num - index];
        decodedString += letterAtIndex;
    }

    return decodedString;
}

/** Diffuses an encoded string; fancy matrix math. */
export function diffuseString(encodedString: number[], matrix: number[]): number[] {
    const diffusedString = new Array(encodedString.length);

    for (let i = 0, len = encodedString.length; i < len; i += 2) {
        diffusedString[i] = encodedString[i] * matrix[0] + encodedString[i + 1] * matrix[2];
        diffusedString[i + 1] = encodedString[i] * matrix[1] + encodedString[i + 1] * matrix[3];
    }

    return diffusedString;
}

/** Takes modulus 26 of all numbers in a diffused string. */
export function wrapString(diffusedString: number[]): number[] {
    const wrappedString = new Array(diffusedString.length);

    for (let i = 0, len = diffusedString.length; i < len; i++) {
        wrappedString[i] = diffusedString[i] % 26;
    }

    return wrappedString;
}
