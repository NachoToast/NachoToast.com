import { MenuItem, Stack, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import ArticleIcon from '@mui/icons-material/ArticleOutlined';

const OpenInNewPage = ({ to }: { to: string }) => {
    return (
        <MenuItem component={Link} to={to}>
            <Stack direction="row" spacing={1}>
                <ArticleIcon />
                <Typography textAlign="right" sx={{ color: 'text.secondary' }}>
                    Click to open in a new page
                </Typography>
            </Stack>
        </MenuItem>
    );
};

export default OpenInNewPage;
