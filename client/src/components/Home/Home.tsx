import {
    Alert,
    Container,
    Fade,
    Grid,
    Snackbar,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { useState } from 'react';
import projectCards from './cards';
import ProjectCard from './ProjectCard/ProjectCard';
import './Home.css';

const colorRotation: string[] = ['white', 'pink', 'aquamarine', 'gold'];

const Home = () => {
    const [currentColorIndex, setCurrentColorIndex] = useState(0);

    const [lottaClicksModalOpen, setLottaClicksModalOpen] = useState(false);

    const handleClose = (_?: any, reason?: string) => {
        if (reason === 'clickaway') return;

        setLottaClicksModalOpen(false);
    };

    const theme = useTheme();
    const notSmall = useMediaQuery(theme.breakpoints.up('sm'));

    return (
        <Container
            style={{
                height: '100vh',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
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
                    onClick={() => {
                        setCurrentColorIndex(currentColorIndex + 1);
                        if (currentColorIndex === 20) {
                            setLottaClicksModalOpen(true);
                        }
                    }}
                    className="noselect"
                >
                    NachoToast.com
                </Typography>
            </Fade>
            <Grid container spacing={3} columns={12}>
                {projectCards.map((card, index) => (
                    <ProjectCard card={card} index={index} key={index} />
                ))}
            </Grid>
            <Snackbar open={lottaClicksModalOpen} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="info" sx={{ width: '100%' }}>
                    Chill 🍦🥶
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Home;
