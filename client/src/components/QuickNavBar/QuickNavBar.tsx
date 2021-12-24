import { SpeedDialIcon, SpeedDialAction, SpeedDial, OpenReason, CloseReason } from '@mui/material';
import { SyntheticEvent, useState } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { useNavigate } from 'react-router-dom';

const QuickNavBar = () => {
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);

    const [clickedOn, setClickedOn] = useState(false);

    function handleOpen(e: SyntheticEvent<any>, reason: OpenReason) {
        e.preventDefault();
        setOpen(true);
    }

    function handleClose(e: SyntheticEvent<any>, reason: CloseReason) {
        e.preventDefault();
        setOpen(false);
    }

    return (
        <SpeedDial
            ariaLabel="Page speed dial"
            sx={{ position: 'fixed', bottom: 16, right: 16 }}
            icon={<SpeedDialIcon openIcon={<QuestionMarkIcon />} />}
            onOpen={handleOpen}
            onClose={handleClose}
            open={clickedOn || open}
            onClick={(e) => {
                e.preventDefault();
                setClickedOn(!clickedOn);
            }}
        >
            <SpeedDialAction
                key="home"
                icon={<HomeIcon />}
                tooltipTitle="Home"
                // tooltipOpen
                onClick={(e) => {
                    e.preventDefault();
                    navigate('/');
                }}
            />
        </SpeedDial>
    );
};

export default QuickNavBar;
