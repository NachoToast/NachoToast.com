import { Tooltip, Typography } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const LinkPage = ({ linkToMake }: { linkToMake: string }) => {
    const navigate = useNavigate();

    const [clicked, setClicked] = useState(false);

    return (
        <Tooltip
            placement="bottom"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setClicked(true);
                navigate(`#${linkToMake}`);
                navigator.clipboard.writeText(window.location.href);
                navigate('');
            }}
            title={
                <Typography variant="body2">
                    {clicked ? `Copied!` : `Copy link to this item`}
                </Typography>
            }
        >
            <LinkIcon color={clicked ? 'success' : 'secondary'} />
        </Tooltip>
    );
};

export default LinkPage;
