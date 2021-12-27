import { Fade, Box, Stack, Divider, Typography, TextField, Tooltip } from '@mui/material';
import React, { FormEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { interpolateTitle } from '../../../../../redux/slices/main.slice';
import Head from '../../../../Head/Head';

const n = <span style={{ color: 'pink' }}>n</span>;

const UtilSpan = ({ util }: { util: string | number }) => (
    <span style={{ color: 'lightgreen' }}>{util}</span>
);
const WaitSpan = ({ wait }: { wait: string | number }) => (
    <span style={{ color: 'aquamarine' }}>{wait}</span>
);

const Util = ({ inline }: { inline?: boolean }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (!inline) {
            dispatch(interpolateTitle(`Utilization Calculator`));
        }
    }, [dispatch, inline]);

    const [utilization, setUtilization] = useState('');
    const [waitTime, setWaitTime] = useState('');

    const [utilizationValid, setUtilizationValid] = useState(false);
    const [waitTimeValid, setWaitTimeValid] = useState(false);

    const [simplified, setSimplified] = useState('');

    const [solvedLog, setSolvedLog] = useState('');

    const [finalAnswer, setFinalAnswer] = useState(-1);

    function handleUtilizationInput(e: FormEvent) {
        e.preventDefault();
        const { value } = e.target as HTMLTextAreaElement;
        setUtilization(value);
        setUtilizationValid(!!value.length && !Number.isNaN(Number(value)));
    }

    function handleWaitTimeInput(e: FormEvent) {
        e.preventDefault();
        const { value } = e.target as HTMLTextAreaElement;
        setWaitTime(value);
        setWaitTimeValid(!!value.length && !Number.isNaN(Number(value)));
    }

    useEffect(() => {
        if (utilizationValid && waitTimeValid) {
            const simplified = 1 - Number(utilization) / 100;
            setSimplified(simplified.toFixed(utilization.length));

            const solvedLog = Math.log(simplified) / Math.log(Number(waitTime) / 100);
            setSolvedLog(solvedLog.toFixed(3) + '...');
            setFinalAnswer(Math.ceil(solvedLog));
        }
    }, [utilization, utilizationValid, waitTime, waitTimeValid]);

    return (
        <Fade in>
            <Box>
                {!inline && (
                    <Head
                        title="Utilization Calculator"
                        description="Calculate the number of programmes needed to be kept in memory to attain a specified % processor utilization."
                    />
                )}
                <Stack
                    spacing={2}
                    alignItems="center"
                    divider={
                        <Fade in={waitTimeValid && utilizationValid}>
                            <Divider flexItem />
                        </Fade>
                    }
                    sx={{ pb: 2 }}
                >
                    <>
                        <TextField
                            type="number"
                            variant="outlined"
                            label={
                                utilizationValid || !utilization.length
                                    ? '% Utilization'
                                    : 'Invalid Utilization'
                            }
                            autoFocus
                            autoComplete="off"
                            placeholder="95"
                            value={utilization}
                            onInput={handleUtilizationInput}
                            color={utilizationValid || !utilization.length ? 'primary' : 'error'}
                        />
                        <TextField
                            type="number"
                            variant="outlined"
                            label={
                                waitTimeValid || !waitTime.length
                                    ? '% Wait Time'
                                    : 'Invalid Wait Time'
                            }
                            autoComplete="off"
                            placeholder="40"
                            value={waitTime}
                            onInput={handleWaitTimeInput}
                            color={waitTimeValid || !waitTime.length ? 'primary' : 'error'}
                        />
                    </>
                    <Fade in={waitTimeValid && utilizationValid}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography color="gray" variant="h6">
                                Formula:
                                <sup />
                            </Typography>
                            <Typography variant="h6">
                                1 - <WaitSpan wait={Number(waitTime) / 100} />
                                <sup>{n}</sup> {'>'}= <UtilSpan util={Number(utilization) / 100} />
                            </Typography>
                        </Stack>
                    </Fade>
                    <Fade in={waitTimeValid && utilizationValid}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography color="gray" variant="h6">
                                Rearranged:
                                <sup />
                            </Typography>
                            <Typography variant="h6">
                                1 - <UtilSpan util={Number(utilization) / 100} />
                                <sup>{n}</sup> {'>'}= <WaitSpan wait={Number(waitTime) / 100} />
                            </Typography>
                        </Stack>
                    </Fade>
                    <Fade in={waitTimeValid && utilizationValid}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography color="gray" variant="h6">
                                Simplified:
                                <sup />
                            </Typography>
                            <Typography variant="h6">
                                <UtilSpan util={simplified} />
                                <sup>{n}</sup> {'>'}= <WaitSpan wait={Number(waitTime) / 100} />
                            </Typography>
                        </Stack>
                    </Fade>
                    <Fade in={waitTimeValid && utilizationValid}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography color="gray" variant="h6">
                                Take Logarithm:
                                <sub />
                            </Typography>
                            <Typography variant="h6">
                                log
                                <sub>
                                    <WaitSpan wait={Number(waitTime) / 100} />
                                </sub>
                                (<UtilSpan util={simplified} />) {'<'}= {n}
                            </Typography>
                        </Stack>
                    </Fade>
                    <Fade in={waitTimeValid && utilizationValid}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography color="gray" variant="h6">
                                Solve:
                            </Typography>
                            <Typography variant="h6">
                                <UtilSpan util={solvedLog} />
                                {' <'}= {n}
                            </Typography>
                        </Stack>
                    </Fade>
                    <Fade in={waitTimeValid && utilizationValid}>
                        <Typography variant="h5">
                            {n} = {finalAnswer}
                        </Typography>
                    </Fade>
                </Stack>
            </Box>
        </Fade>
    );
};

export default Util;
