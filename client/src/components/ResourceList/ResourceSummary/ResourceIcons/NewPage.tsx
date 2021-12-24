import ArticleIcon from '@mui/icons-material/ArticleOutlined';
import { Link } from 'react-router-dom';
import { Tooltip, Typography } from '@mui/material';

const NewPage = ({ navigatesTo }: { navigatesTo: string }) => {
    return (
        <Link to={navigatesTo}>
            <Tooltip
                placement="bottom"
                onClick={(e) => e.stopPropagation()}
                title={<Typography variant="body2">Open in new page</Typography>}
            >
                <ArticleIcon color="primary" />
            </Tooltip>
        </Link>
    );
};

export default NewPage;
