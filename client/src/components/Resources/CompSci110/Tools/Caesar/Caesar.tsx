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
    Grid,
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
                    divider={
                        <Fade in={!!inputString.length}>
                            <Divider flexItem />
                        </Fade>
                    }
                    sx={{ pb: 2 }}
                >
                    <Stack direction="row" sx={{ width: '100%' }} justifyContent="center">
                        <TextField
                            variant="outlined"
                            label="Input String"
                            autoComplete="off"
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
                        <Stack direction="row" sx={{ width: '100%' }} justifyContent="space-evenly">
                            {[
                                [0, 8],
                                [8, 17],
                                [17, 26],
                            ].map((e1, i1) => {
                                return (
                                    <Stack key={i1} spacing={1}>
                                        {outputs.slice(e1[0], e1[1]).map((e, i) => {
                                            i += e1[0];
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
                                            return (
                                                <span key={i}>
                                                    {i + 1}: {e}
                                                </span>
                                            );
                                        })}
                                    </Stack>
                                );
                            })}
                        </Stack>
                    </Fade>
                </Stack>
            </Box>
        </Fade>
    );
};

export default Caesar;
