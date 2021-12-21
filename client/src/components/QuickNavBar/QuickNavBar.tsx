import { SpeedDialIcon, SpeedDialAction, SpeedDial } from '@mui/material';
import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { useNavigate } from 'react-router-dom';

const QuickNavBar = () => {
    const navigate = useNavigate();

    function handleClick(e: React.MouseEvent) {
        e.preventDefault();
        navigate('/');
    }

    return (
        <SpeedDial
            ariaLabel="Page speed dial"
            sx={{ position: 'fixed', bottom: 16, right: 16 }}
            icon={<SpeedDialIcon openIcon={<QuestionMarkIcon />} />}
        >
            <SpeedDialAction
                key="home"
                icon={<HomeIcon />}
                tooltipTitle="Home"
                // tooltipOpen
                onClick={handleClick}
            />
        </SpeedDial>
    );
};

export default QuickNavBar;
