import {
    Grid,
    Box,
    Slider,
    Typography,
    useMediaQuery,
    useTheme,
    Button,
    Stack,
    Tooltip,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ColourTile from './ColourTile';

const Palette = ({ colours, title }: { colours: string[]; title: string }) => {
    const theme = useTheme();
    const isMedium = useMediaQuery(theme.breakpoints.down('md'));
    const isSmol = useMediaQuery(theme.breakpoints.down('sm'));

    const [maxColours, setMaxColours] = useState(isSmol ? 9 : 18);

    useEffect(() => {
        setMaxColours(isSmol ? 9 : 18);
    }, [isMedium, isSmol]);

    const sizeCalculator = useCallback(() => {
        if (isSmol) return 30;
        if (isMedium) return 75;
        return 100;
    }, [isMedium, isSmol]);

    useEffect(() => {
        setSize(sizeCalculator());
    }, [sizeCalculator]);

    const [size, setSize] = useState(() => sizeCalculator());

    const [displayedIndexes, setDisplayedIndexes] = useState<number[]>([0, 1, 2]);

    const [numColours, setNumColours] = useState(3);

    function handleNumChange(e: Event, newValue: number | number[]) {
        e.preventDefault();
        setNumColours(newValue as number);
    }

    useEffect(() => {
        let coloursToShow = numColours;
        if (numColours > maxColours) {
            setNumColours(maxColours);
            coloursToShow = maxColours;
        }

        let step = Math.floor(colours.length / coloursToShow);

        let displayedIndexes: number[] = [];

        let insertionIndex = 0;
        while (displayedIndexes.length < coloursToShow) {
            displayedIndexes.push(insertionIndex);
            insertionIndex = (insertionIndex + step) % colours.length;
        }

        setDisplayedIndexes(displayedIndexes);
    }, [colours.length, maxColours, numColours]);

    async function exportCanvasToPNG(e: React.MouseEvent<HTMLButtonElement>): Promise<void> {
        e.preventDefault();

        const canvas = document.createElement('canvas');
        canvas.width = 50 * displayedIndexes.length;
        canvas.height = 50;
        const ctx = canvas.getContext('2d')!;

        for (let i = 0, len = displayedIndexes.length; i < len; i++) {
            ctx.beginPath();
            ctx.rect(i * 50, 0, 50, 50);
            ctx.fillStyle = colours[displayedIndexes[i]];
            ctx.fill();
        }

        const a = document.createElement('a');
        a.href = canvas.toDataURL();
        a.download = 'palette.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                {title}
            </Typography>
            <Grid container sx={{ minHeight: 2 * size }}>
                {displayedIndexes.map((e, i) => (
                    <ColourTile size={size} key={`${e}${i}`} colour={colours[e]} />
                ))}
            </Grid>
            <Stack direction="row" spacing={1} sx={{ width: '50%', mt: 1 }} alignItems="center">
                <Slider
                    value={numColours}
                    onChange={handleNumChange}
                    valueLabelDisplay="auto"
                    min={3}
                    max={maxColours}
                />
                <Button onClick={exportCanvasToPNG}>
                    <Tooltip placement="top" title={<Typography>Download Palette</Typography>}>
                        <FileDownloadIcon />
                    </Tooltip>
                </Button>
            </Stack>
        </Box>
    );
};

export default Palette;
