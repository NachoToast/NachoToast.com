import {
    Box,
    Divider,
    Fade,
    FormControlLabel,
    Stack,
    Switch,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { interpolateTitle } from '../../../../../redux/slices/main.slice';

const rawAlphabet = 'abcdefghijklmnopqrstuvwxyz';
const alphabetLower = rawAlphabet.split('');

const stringValidationRegex = new RegExp(/^[a-zA-Z]+$/);

const Block = ({ dontChangeTitle }: { dontChangeTitle?: boolean }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (!dontChangeTitle) {
            dispatch(interpolateTitle(`Block Cipher Decoder`));
        }
    }, [dispatch, dontChangeTitle]);

    /// state management

    // matrix
    const [inputMatrix, setInputMatrix] = useState('');
    const [isMatrixValid, setIsMatrixValid] = useState(false);
    const [invertedMatrix, setInvertedMatrix] = useState<number[]>([]);
    const [wrappedInvertedMatrix, setWrappedInvertedMatrix] = useState<number[]>([]);

    // string
    const [inputString, setInputString] = useState('');
    const [isStringValid, setIsStringValid] = useState(false);
    const [encodedString, setEncodedString] = useState<number[]>([]);
    const [diffusedString, setDiffusedString] = useState<number[]>([]);
    const [wrappedString, setWrappedString] = useState<number[]>([]);
    const [decodedString, setDecodedString] = useState('');

    // other
    const [basedIndex, setBasedIndex] = useState(0);
    const [conversionMode, setConversionMode] = useState(0); // 0 = decode, 1 = encode
    const [allUppercase, setAllUppercase] = useState(false);

    /// input handling

    function handleMatrixInput(e: FormEvent) {
        e.preventDefault();
        const { value } = e.target as HTMLTextAreaElement;
        setInputMatrix(value);
    }

    function handleStringInput(e: FormEvent) {
        e.preventDefault();
        const { value } = e.target as HTMLTextAreaElement;
        setInputString(value);
        if (value.toUpperCase() === value) {
            setAllUppercase(true);
        } else {
            setAllUppercase(false);
        }
    }

    function handleBasedIndexSwitch({ target: { checked } }: ChangeEvent<HTMLInputElement>) {
        setBasedIndex(Number(!checked));
    }

    function handleConversionModeSwitch({ target: { checked } }: ChangeEvent<HTMLInputElement>) {
        setConversionMode(Number(checked));
    }

    useEffect(() => {
        const splitMatrix = inputMatrix.split(' ');
        const matrixValid =
            splitMatrix.length === 4 &&
            splitMatrix.every((e) => !!e && Number.isInteger(Number(e)));
        setIsMatrixValid(matrixValid);

        const stringValid =
            !!inputString.length &&
            inputString.length % 2 === 0 &&
            stringValidationRegex.test(inputString);
        setIsStringValid(stringValid);

        let finalMatrix: number[] = [];
        let finalInvertedMatrix: number[] = [];

        if (matrixValid) {
            finalMatrix = splitMatrix.map((e) => parseInt(e));
            const invertedMatrix = invertMatrix(finalMatrix);
            setInvertedMatrix(invertedMatrix);
            finalInvertedMatrix = invertedMatrix.map((e) => (e < 0 ? e + 26 : e));
            setWrappedInvertedMatrix(finalInvertedMatrix);
        } else {
            // setInvertedMatrix([]);
            // setWrappedInvertedMatrix([]);
        }

        if (stringValid) {
            const encodedString = encodeString(inputString.toLowerCase(), basedIndex);
            setEncodedString(encodedString);

            if (matrixValid) {
                const matrixToUse = conversionMode === 0 ? finalInvertedMatrix : finalMatrix;
                const diffusedString = diffuseString(encodedString, matrixToUse);

                setDiffusedString(diffusedString);

                const wrappedString = wrapString(diffusedString);
                setWrappedString(wrappedString);

                const decodedString = decodeString(wrappedString, basedIndex);
                setDecodedString(decodedString);
            }
        } else {
            // setEncodedString([]);
        }

        if (!stringValid || !matrixValid) {
            // setDiffusedString([]);
            // setWrappedString([]);
            // setDecodedString('');
        }

        return () => {
            // cleanup
        };
    }, [basedIndex, conversionMode, inputMatrix, inputString]);

    /// actual math

    /** Inverts a 2x2 matrix.
     * @example invertMatrix([3, 2, 7, 5]) -> [5, -2, -7, 3]
     */
    function invertMatrix(matrix: number[]): number[] {
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
    function encodeString(inputString: string, index: number = 0): number[] {
        const encodedString = new Array(inputString.length);

        for (let i = 0, len = inputString.length; i < len; i++) {
            encodedString[i] = alphabetLower.indexOf(inputString[i]) + index;
        }

        return encodedString;
    }

    /** Turns an array of numbers into a string based on alphabetical index.
     * @example decodeString([0, 1, 2], 0) -> 'abc'
     * @example decodeString([3, 4, 5], 1) -> 'cde'
     */
    function decodeString(inputArray: number[], index: number = 0): string {
        let decodedString = '';

        for (const num of inputArray) {
            const letterAtIndex = alphabetLower[num - index];
            decodedString += letterAtIndex;
        }

        return decodedString;
    }

    /** Diffuses an encoded string; fancy matrix math. */
    function diffuseString(encodedString: number[], matrix: number[]): number[] {
        const diffusedString = new Array(encodedString.length);

        for (let i = 0, len = encodedString.length; i < len; i += 2) {
            diffusedString[i] = encodedString[i] * matrix[0] + encodedString[i + 1] * matrix[2];
            diffusedString[i + 1] = encodedString[i] * matrix[1] + encodedString[i + 1] * matrix[3];
        }

        return diffusedString;
    }

    /** Takes modulus 26 of all numbers in a diffused string. */
    function wrapString(diffusedString: number[]): number[] {
        const wrappedString = new Array(diffusedString.length);

        for (let i = 0, len = diffusedString.length; i < len; i++) {
            wrappedString[i] = diffusedString[i] % 26;
        }

        return wrappedString;
    }

    return (
        <Fade in>
            <Box>
                <Stack
                    spacing={2}
                    alignItems="center"
                    divider={<Divider flexItem />}
                    sx={{ pb: 2 }}
                >
                    <>
                        <Typography variant="body1" align="center">
                            2x2 matrix, separate numbers with spaces
                        </Typography>
                        <TextField
                            variant="outlined"
                            label={
                                isMatrixValid || !inputMatrix.length
                                    ? 'Input Matrix'
                                    : 'Invalid Matrix'
                            }
                            required
                            autoFocus
                            autoComplete="off"
                            placeholder="3 2 7 5"
                            value={inputMatrix}
                            onInput={handleMatrixInput}
                            color={isMatrixValid || !inputMatrix.length ? 'primary' : 'error'}
                        />
                    </>
                    <>
                        <Typography variant="body1" align="center">
                            String to {!!conversionMode ? 'decode' : 'encode'}
                        </Typography>
                        <TextField
                            variant="outlined"
                            label={
                                isStringValid || !inputString.length
                                    ? 'Input String'
                                    : 'Invalid String'
                            }
                            required
                            autoComplete="off"
                            placeholder="MXOSHI"
                            value={inputString}
                            onInput={handleStringInput}
                            color={isStringValid || !inputString.length ? 'primary' : 'error'}
                        />
                    </>
                    <>
                        <Stack direction="row" spacing={2}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={!!conversionMode}
                                        onChange={handleConversionModeSwitch}
                                    />
                                }
                                label="Encode"
                            />
                            <Tooltip
                                title={
                                    <Typography>
                                        {!basedIndex ? `a=0, b=1, c=2` : `a=1, b=2, c=3`}
                                    </Typography>
                                }
                                placement="top"
                            >
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={!basedIndex}
                                            onChange={handleBasedIndexSwitch}
                                        />
                                    }
                                    label="Zero Index"
                                />
                            </Tooltip>
                        </Stack>
                    </>
                    <Fade in={isMatrixValid}>
                        <div>
                            <Typography variant="body1" align="center" gutterBottom>
                                Inverted Matrix: {invertedMatrix.join(', ')}
                            </Typography>
                            <Typography variant="body1" align="center">
                                With Modulus: {wrappedInvertedMatrix.join(', ')}
                            </Typography>
                        </div>
                    </Fade>
                    <Fade in={isStringValid}>
                        <div>
                            <Typography variant="body1" align="center" gutterBottom>
                                Numerical String: {encodedString.join(', ')}
                            </Typography>
                        </div>
                    </Fade>
                    <Fade in={isMatrixValid && isStringValid}>
                        <div>
                            <Typography variant="body1" align="center" gutterBottom>
                                Diffused String: {diffusedString.join(', ')}
                            </Typography>
                            <Typography variant="body1" align="center">
                                With Modulus: {wrappedString.join(', ')}
                            </Typography>
                        </div>
                    </Fade>
                    <Fade in={isMatrixValid && isStringValid}>
                        <div>
                            <Typography variant="h5" align="center" gutterBottom>
                                {conversionMode === 0 ? 'Decoded' : 'Encoded'} String:{' '}
                                <span style={{ color: 'gold' }}>
                                    {allUppercase ? decodedString.toUpperCase() : decodedString}
                                </span>
                            </Typography>
                        </div>
                    </Fade>
                </Stack>
            </Box>
        </Fade>
    );
};

export default Block;
