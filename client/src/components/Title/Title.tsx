import { Alert, Fade, Snackbar, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { getTitle } from '../../redux/slices/main.slice';
import './Tile.css';
import QuickNavBar from '../QuickNavBar/QuickNavBar';

const colorRotation: string[] = ['white', 'pink', 'aquamarine', 'gold'];

const Title = () => {
    const title = useSelector(getTitle);

    const [currentColorIndex, setCurrentColorIndex] = useState(0);

    const [modalOpen, setModalOpen] = useState(false);

    function handleClose(_?: any, reason?: string) {
        if (reason === 'clickaway') return;
        setModalOpen(false);
    }
    const theme = useTheme();
    const notSmall = useMediaQuery(theme.breakpoints.up('sm'));

    return (
        <>
            <QuickNavBar />
            <Fade in timeout={2000}>
                <Typography
                    variant="h1"
                    align="center"
                    gutterBottom
                    style={{
                        cursor: 'default',
                        color: colorRotation[currentColorIndex % colorRotation.length],
                        paddingTop: notSmall ? '' : '0.5rem',
                    }}
                    sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                    onClick={() => {
                        setCurrentColorIndex(currentColorIndex + 1);
                        if (currentColorIndex === 20) {
                            setModalOpen(true);
                        }
                    }}
                    className="noselect"
                >
                    {title}
                    <span className="blinking_cursor">|</span>
                </Typography>
            </Fade>
            <Snackbar open={modalOpen} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="info" sx={{ width: '100%' }}>
                    Chill 🍦🥶
                </Alert>
            </Snackbar>
        </>
    );
};

export default Title;
