import { Grid, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import './ColourTile.css';

const ColourTile = ({ colour, size }: { colour: string; size: number }) => {
    const [tooltip, setTooltip] = useState(colour);

    function copyColour(e: React.MouseEvent<HTMLDivElement>) {
        e.preventDefault();
        navigator.clipboard.writeText(colour);
        setTooltip(`copied!`);
    }

    useEffect(() => {
        const myTimeout = setTimeout(() => setTooltip(colour), 1000);

        return () => {
            clearTimeout(myTimeout);
        };
    }, [colour, tooltip]);

    return (
        <Tooltip placement="top" title={<Typography>{tooltip}</Typography>}>
            <Grid
                onClick={copyColour}
                item
                sx={{
                    backgroundColor: colour,
                    filter: tooltip !== colour ? `brightness(50%)` : undefined,
                }}
                className="colourTile"
                height={size}
                width={size}
            ></Grid>
        </Tooltip>
    );
};

export default ColourTile;
