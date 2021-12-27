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
import Head from '../../../../Head/Head';

import {
    invertMatrix,
    encodeString,
    decodeString,
    diffuseString,
    wrapString,
} from './blockHelpers';

const stringValidationRegex = new RegExp(/^[a-zA-Z]+$/);

const Block = ({ inline }: { inline?: boolean }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (!inline) {
            dispatch(interpolateTitle(`Block Cipher Decoder`));
        }
    }, [dispatch, inline]);

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
        }
    }, [basedIndex, conversionMode, inputMatrix, inputString]);

    return (
        <Fade in>
            <Box>
                {!inline && (
                    <Head
                        title="Block Cipher Decoder"
                        description="Decode and encode text via a block cipher."
                    />
                )}
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
