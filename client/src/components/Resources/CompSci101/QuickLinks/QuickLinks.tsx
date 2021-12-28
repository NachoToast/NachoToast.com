import { Link, Stack } from '@mui/material';

import DashboardIcon from '@mui/icons-material/Dashboard';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import CodeIcon from '@mui/icons-material/Code';
import CreateIcon from '@mui/icons-material/Create';
import ForumIcon from '@mui/icons-material/Forum';
import ArticleIcon from '@mui/icons-material/Article';
import InfoIcon from '@mui/icons-material/Info';

const QuickLinks = () => {
    return (
        <Stack spacing={1} sx={{ ml: 3 }}>
            <Stack direction="row" spacing={1}>
                <DashboardIcon />
                <Link
                    className="noselect"
                    target="_blank"
                    href="https://uoa.tukib.org/"
                    rel="noopener"
                    underline="hover"
                    sx={{ color: 'white' }}
                >
                    Bryn's Dashboard
                </Link>
            </Stack>
            <Stack direction="row" spacing={1}>
                <NoteAltIcon />
                <Link
                    className="noselect"
                    target="_blank"
                    href="https://notes.joewuthrich.com/compsci101"
                    rel="noopener"
                    underline="hover"
                    sx={{ color: 'white' }}
                >
                    Joe's Notes
                </Link>
            </Stack>
            <Stack direction="row" spacing={1}>
                <CodeIcon />
                <Link
                    className="noselect"
                    target="_blank"
                    href="https://coderunner.auckland.ac.nz/moodle/my/"
                    rel="noopener"
                    underline="hover"
                    sx={{ color: 'white' }}
                >
                    Coderunner
                </Link>
            </Stack>
            <Stack direction="row" spacing={1}>
                <CreateIcon />
                <Link
                    className="noselect"
                    target="_blank"
                    href="https://canvas.auckland.ac.nz/"
                    rel="noopener"
                    underline="hover"
                    sx={{ color: 'white' }}
                >
                    Canvas
                </Link>
            </Stack>
            <Stack direction="row" spacing={1}>
                <ForumIcon />
                <Link
                    className="noselect"
                    target="_blank"
                    href="https://discord.gg/QZgUWJQhJ7"
                    rel="noopener"
                    underline="hover"
                    sx={{ color: 'white' }}
                >
                    Discord
                </Link>
            </Stack>
            <Stack direction="row" spacing={1}>
                <ArticleIcon />
                <Link
                    className="noselect"
                    target="_blank"
                    href="https://www.library.auckland.ac.nz/exam-papers/subject/Computer%20Science/COMPSCI%20101"
                    rel="noopener"
                    underline="hover"
                    sx={{ color: 'white' }}
                >
                    Past Papers
                </Link>
            </Stack>
            <Stack direction="row" spacing={1}>
                <InfoIcon />
                <Link
                    className="noselect"
                    target="_blank"
                    href="https://www.calendar.auckland.ac.nz/en/courses/faculty-of-science/computer-science.html#COMPSCI_101Principles_of_Programming"
                    rel="noopener"
                    underline="hover"
                    sx={{ color: 'white' }}
                >
                    Course Info
                </Link>
            </Stack>
        </Stack>
    );
};

export default QuickLinks;
