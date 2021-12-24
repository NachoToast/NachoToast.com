import {
    Fade,
    Box,
    Stack,
    Divider,
    TextField,
    FormControlLabel,
    Switch,
    Tooltip,
    Typography,
} from '@mui/material';
import { FormEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { interpolateTitle } from '../../../../../redux/slices/main.slice';
import { alphabet, estimateLikelihood, shiftLetter } from './caesarHelpers';
import WarningIcon from '@mui/icons-material/Warning';

const Caesar = ({ dontChangeTitle }: { dontChangeTitle?: boolean }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (!dontChangeTitle) {
            dispatch(interpolateTitle(`Caesar Cipher Decoder`));
        }
    }, [dispatch, dontChangeTitle]);

    const [conversionMode, setConversionMode] = useState(1); // 1 = decode, -1 = encode
    const [inputString, setInputString] = useState('');

    const [outputs, setOutputs] = useState<string[]>([]);
    const [bestOutput, setBestOutput] = useState(-1);
    const [badChars, setBadChars] = useState<string[]>([]);

    function handleConversionModeSwitch({
        target: { checked },
    }: React.ChangeEvent<HTMLInputElement>) {
        setConversionMode(checked ? -1 : 1);
    }

    function handleStringInput(e: FormEvent) {
        e.preventDefault();
        const { value } = e.target as HTMLTextAreaElement;
        setInputString(value);
    }

    useEffect(() => {
        if (inputString) {
            let newBestOutput = -1;
            let bestOutputScore = 0;
            const newBadChars: string[] = [];
            const inputLower = inputString.toLowerCase();
            const newOutputs: string[] = new Array(25).fill('');

            for (let i = 0, len = inputString.length; i < len; i++) {
                let appendedChar = inputString[i];
                let doShifting = false;

                if (inputLower[i] !== ' ') {
                    if (alphabet.indexOf(inputLower[i]) === -1) {
                        if (newBadChars.indexOf(inputLower[i]) === -1) {
                            newBadChars.push(inputString[i]);
                        }
                    } else {
                        appendedChar = inputLower[i];
                        doShifting = true;
                    }
                }

                if (doShifting) {
                    newOutputs.forEach((_, index) => {
                        newOutputs[index] += shiftLetter(
                            appendedChar,
                            (index + 1) * conversionMode,
                        );
                    });
                } else {
                    newOutputs.forEach((_, index) => {
                        newOutputs[index] += appendedChar;
                    });
                }
            }

            newOutputs.forEach((e, i) => {
                const score = estimateLikelihood(e);
                if (score > bestOutputScore) {
                    newBestOutput = i;
                    bestOutputScore = score;
                }
            });

            setOutputs(newOutputs);
            setBadChars(newBadChars);
            setBestOutput(newBestOutput);
        }
    }, [conversionMode, inputString]);

    return (
        <Fade in>
            <Box>
                <Stack
                    spacing={2}
                    alignItems="center"
                    divider={<Divider flexItem />}
                    sx={{ pb: 2 }}
                >
                    <Stack direction="row" sx={{ width: '100%' }} justifyContent="center">
                        <TextField
                            variant="outlined"
                            label="Input String"
                            required
                            autoComplete="off"
                            placeholder="mpmalluadlsclalu"
                            value={inputString}
                            onInput={handleStringInput}
                            color="primary"
                        />
                        <FormControlLabel
                            sx={{ ml: 2 }}
                            control={
                                <Switch
                                    checked={conversionMode === -1}
                                    onChange={handleConversionModeSwitch}
                                />
                            }
                            label="Encode"
                        />
                        <Fade in={!!badChars.length}>
                            <Tooltip
                                title={
                                    <Typography variant="body1" textAlign="center">
                                        Some characters couldn't be{' '}
                                        {conversionMode === 1 ? 'decoded' : 'encoded'}:{' '}
                                        {badChars.map((e, i) => (
                                            <span
                                                key={i}
                                                style={{ color: 'lightcoral', fontSize: 20 }}
                                            >
                                                {e}
                                            </span>
                                        ))}
                                    </Typography>
                                }
                            >
                                <WarningIcon
                                    fontSize="large"
                                    sx={{ alignSelf: 'center' }}
                                    color="warning"
                                />
                            </Tooltip>
                        </Fade>
                    </Stack>
                    <Fade in={!!inputString.length}>
                        <Stack>
                            {outputs.map((e, i) => {
                                if (conversionMode === 1 && i === bestOutput) {
                                    return (
                                        <Tooltip
                                            key={i}
                                            title="Most confident answer"
                                            placement="right"
                                            arrow
                                        >
                                            <span style={{ color: 'lightgreen' }}>
                                                {i + 1}: {e}
                                            </span>
                                        </Tooltip>
                                    );
                                }
                                // do stuff
                                return (
                                    <span key={i}>
                                        {i + 1}: {e}
                                    </span>
                                );
                            })}
                        </Stack>
                    </Fade>
                    <div>
                        {badChars.map((e, i) => {
                            return <span key={i}>{e}</span>;
                        })}
                    </div>
                    {/* <Fade in={isMatrixValid}>
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
                </Fade> */}
                </Stack>
            </Box>
        </Fade>
    );
};

export default Caesar;
