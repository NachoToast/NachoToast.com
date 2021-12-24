import React from 'react';
import AutoDeleteIcon from '@mui/icons-material/AutoDelete';
import { Tooltip, Typography } from '@mui/material';

const OldPage = () => {
    return (
        <Tooltip
            placement="top"
            title={<Typography variant="body2">From an older version of the website</Typography>}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
        >
            <AutoDeleteIcon color="warning" style={{ cursor: 'default' }} />
        </Tooltip>
    );
};

export default OldPage;
