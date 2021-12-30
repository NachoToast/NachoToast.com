import { Fade, Box, Stack, Divider, Typography, TextField, Tooltip } from '@mui/material';
import React, { FormEvent, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { interpolateTitle } from '../../../../../redux/slices/main.slice';
import WarningIcon from '@mui/icons-material/Warning';
import { binaryToHex } from './floatHelpers';

const colors = {
    signOfMantissa: 'pink',
    mantissa: 'aquamarine',
    signOfExponent: 'gold',
    exponent: 'lightgreen',
};

function colourChooser(index: number): string {
    if (index === 0) return colors.signOfMantissa;
    if (index < 10) return colors.mantissa;
    if (index < 11) return colors.signOfExponent;
    return colors.exponent;
}

const MinusSign = ({ forExponent }: { forExponent?: boolean }) => {
    return (
        <span
            style={{
                color: forExponent ? colors.signOfExponent : colors.signOfMantissa,
                fontWeight: 'bold',
            }}
        >
            -
        </span>
    );
};

const Float = ({ inline }: { inline?: boolean }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (!inline) {
            dispatch(interpolateTitle(`Floating Point Calculator`));
        }
    }, [dispatch, inline]);

    const [decimalInput, setDecimalInput] = useState('');
    const [inputValid, setInputValid] = useState(false);

    const [binaryForm, setBinaryForm] = useState('');
    const [fullBinaryForm, setFullBinaryForm] = useState('');

    const [standardForm, setStandardForm] = useState<[string, number]>(['', 0]);

    const [signOfMantissa, setSignOfMantissa] = useState<0 | 1>(0);
    const [mantissa, setMantissa] = useState('');
    const [signOfExponent, setSignOfExponent] = useState<0 | 1>(0);
    const [exponent, setExponent] = useState('');

    const [binaryFloat, setBinaryFloat] = useState('');
    const [finalFloat, setFinalFloat] = useState('');

    function handleDecimalInput(e: FormEvent) {
        e.preventDefault();
        const { value } = e.target as HTMLTextAreaElement;
        setDecimalInput(value);
        setInputValid(
            !!value.length && !Number.isNaN(Number(value)) && !value.trim().includes(' '),
        );
    }

    useEffect(() => {
        if (!inputValid) return;

        // binary conversion
        let input = parseFloat(decimalInput);
        const isNegative = input < 0;

        input = Math.abs(input);
        let binaryStringForm = input.toString(2);
        setFullBinaryForm(binaryStringForm);
        binaryStringForm = binaryStringForm.slice(0, binaryStringForm.includes('.') ? 10 : 9);
        setBinaryForm(binaryStringForm);

        const binaryForm = parseFloat(binaryStringForm);

        // standard form conversion
        let standardForm = binaryStringForm;
        const decimalPointIndex = standardForm.indexOf('.');
        let exponent = 0;

        if (decimalPointIndex !== -1) {
            // in the case of decimal binary values

            if (binaryForm < 1) {
                // in the case of small decimal binary values, e.g. 0.01, 0.1101
                let decimalString = standardForm.substring(decimalPointIndex + 1); // gets part after decimal point

                // i have no clue what this does lol
                let endIndex = decimalString.indexOf('1');
                if (endIndex !== -1) {
                    decimalString = decimalString.substring(0, endIndex);
                }
                exponent = -decimalString.length;
            } else {
                // in the case of large decimal binary values, e.g. 101.1, 100111.1
                let nonDecimalString = standardForm.substring(0, decimalPointIndex); // gets part before decimal point
                exponent = nonDecimalString.length;
            }
        } else {
            // in the case of whole binary values
            exponent = standardForm.length;
        }

        if (decimalPointIndex !== -1) {
            // remove decimal point from value now that exponent has been extracted
            standardForm =
                standardForm.substring(0, decimalPointIndex) +
                standardForm.substring(decimalPointIndex + 1);
        }
        if (standardForm.indexOf('1') !== -1) {
            // again no clue what this does
            standardForm = standardForm.substring(standardForm.indexOf('1'));
        }

        const isExponentNegative = exponent < 0;
        setStandardForm([standardForm, exponent]);
        exponent = Math.abs(exponent);

        // individual components
        const signOfMantissa = isNegative ? 1 : 0;
        setSignOfMantissa(signOfMantissa);
        let mantissa = standardForm;
        while (mantissa.length < 9) {
            mantissa += '0';
        }
        setMantissa(mantissa);
        const signOfExponent = isExponentNegative ? 1 : 0;
        setSignOfExponent(signOfExponent);
        let stringExponent = exponent.toString(2); // converting exponent to binary
        while (stringExponent.length < 5) {
            stringExponent = '0' + stringExponent;
        }
        setExponent(stringExponent);

        // decimal float format
        const nibbles = [
            `${signOfMantissa}${mantissa.slice(0, 3)}`,
            `${mantissa.slice(3, 7)}`,
            `${mantissa.slice(7)}${signOfExponent}${stringExponent.slice(0, 1)}`,
            `${stringExponent.slice(1)}`,
        ];
        setBinaryFloat(nibbles.join(''));

        setFinalFloat(nibbles.map((e) => binaryToHex(e)).join(''));
    }, [inputValid, decimalInput]);

    // -0.015625

    return (
        <Fade in>
            <Box>
                {/* {!inline && (
                    <Head
                        title="Floating Point Calculator"
                        description="Calculate the hexadecimal floating point number of a binary float under the CompSci 110 textbook standard."
                    />
                )} */}
                <Stack
                    spacing={2}
                    alignItems="center"
                    divider={
                        <Fade in={inputValid}>
                            <Divider flexItem />
                        </Fade>
                    }
                    sx={{ pb: 2 }}
                >
                    <TextField
                        type="number"
                        variant="outlined"
                        label={
                            inputValid || !decimalInput.length ? 'Decimal Input' : 'Invalid Input'
                        }
                        autoFocus
                        autoComplete="off"
                        placeholder="-128.5"
                        value={decimalInput}
                        onInput={handleDecimalInput}
                        color={inputValid || !decimalInput.length ? 'primary' : 'error'}
                    />
                    <Fade in={inputValid}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography>
                                Binary Form ({binaryForm.replace('.', '').length} bit
                                {binaryForm.length > 1 ? 's' : ''}):
                            </Typography>
                            <Typography>
                                {signOfMantissa === 1 && <MinusSign />}
                                {binaryForm}
                            </Typography>
                            {binaryForm !== fullBinaryForm && (
                                <Tooltip
                                    title={
                                        <Typography variant="body1" textAlign="center">
                                            Had to round down from{' '}
                                            {fullBinaryForm.replace('.', '').length} bits:
                                            <br />
                                            {decimalInput} in binary = {signOfMantissa === 1 && '-'}
                                            {fullBinaryForm
                                                .replace('.', '')
                                                .split('')
                                                .slice(0, 13)
                                                .map((e, i) => (
                                                    <span key={i}>
                                                        {fullBinaryForm[i] === '.' ? '.' : ''}
                                                        {e}
                                                        <sub
                                                            style={{
                                                                color:
                                                                    i + 1 > 9
                                                                        ? 'lightcoral'
                                                                        : 'lightgreen',
                                                            }}
                                                        >
                                                            {i + 1}
                                                        </sub>
                                                    </span>
                                                ))}
                                            {fullBinaryForm.replace('.', '').length > 13 && (
                                                <span> ...</span>
                                            )}
                                        </Typography>
                                    }
                                >
                                    <WarningIcon color="warning" fontSize="large" />
                                </Tooltip>
                            )}
                        </Stack>
                    </Fade>
                    <Fade in={inputValid}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography>Standard Form:</Typography>
                            <Typography>
                                {signOfMantissa && (
                                    <span>
                                        <MinusSign />{' '}
                                    </span>
                                )}
                                .{<span style={{ color: colors.mantissa }}>{standardForm[0]}</span>}{' '}
                                x 2<sup style={{ color: colors.exponent }}>{standardForm[1]}</sup>
                            </Typography>
                        </Stack>
                    </Fade>
                    <Fade in={inputValid}>
                        <Stack direction="row" alignItems="center" spacing={4}>
                            <Stack alignItems="center">
                                <Typography>Sign of Mantissa</Typography>
                                <Typography color={colors.signOfMantissa}>
                                    {signOfMantissa}
                                </Typography>
                            </Stack>
                            <Stack alignItems="center">
                                <Typography>Mantissa</Typography>
                                <Typography color={colors.mantissa}>{mantissa}</Typography>
                            </Stack>
                            <Stack alignItems="center">
                                <Typography>Sign of Exponent</Typography>
                                <Typography color={colors.signOfExponent}>
                                    {signOfExponent}
                                </Typography>
                            </Stack>
                            <Stack alignItems="center">
                                <Typography>Exponent</Typography>
                                <Typography color={colors.exponent}>{exponent}</Typography>
                            </Stack>
                        </Stack>
                    </Fade>
                    <Fade in={inputValid}>
                        <Stack direction="row" spacing={4}>
                            {[0, 1, 2, 3].map((e) => (
                                <Typography variant="h5" key={e}>
                                    {binaryFloat
                                        .slice(4 * e, 4 * e + 4)
                                        .split('')
                                        .map((bit, i) => (
                                            <span
                                                key={i}
                                                style={{ color: colourChooser(4 * e + i) }}
                                            >
                                                {bit}
                                            </span>
                                        ))}
                                </Typography>
                            ))}
                        </Stack>
                    </Fade>
                    <Fade in={inputValid}>
                        <Stack direction="row" spacing={2}>
                            {finalFloat.split('').map((e, i) => (
                                <Typography variant="h4" key={i}>
                                    {e}
                                </Typography>
                            ))}
                        </Stack>
                    </Fade>
                </Stack>
            </Box>
        </Fade>
    );
};

export default Float;
