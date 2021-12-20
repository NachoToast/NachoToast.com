import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Fade,
    Grid,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { useState } from 'react';
import { ProjectCard as ProjectCardType } from '../cards';
import githubProfile from '../../../assets/projectCardImages/githubProfile.png';
import { useNavigate } from 'react-router-dom';

const ProjectCard = ({ card, index }: { card: ProjectCardType; index: number }) => {
    const navigate = useNavigate();

    const theme = useTheme();
    const notSmall = useMediaQuery(theme.breakpoints.up('sm'));

    function handleClick(event: React.MouseEvent) {
        // blah blah blah
        event.preventDefault();
        if (card?.destination) {
            navigate(card.destination);
        }
    }

    return (
        <Grid item xs={12} sm={6} md={4} lg={3}>
            <Fade
                in
                timeout={{ enter: 1000, exit: 1000 }}
                style={{ transitionDelay: `${400 * Math.random() + index ** 2 * 10}ms` }}
            >
                <Card className="projectCard" style={{ height: '100%' }} onClick={handleClick}>
                    <CardActionArea>
                        <CardMedia
                            component="img"
                            image={card?.imageSource || githubProfile}
                            alt={
                                card?.imageAlt ||
                                `The default photo, NachoToast's github profile picture.`
                            }
                            style={{ display: notSmall ? 'unset' : 'none' }}
                        />
                        <CardContent>
                            <Typography align="center" variant="h4">
                                {card.name}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Fade>
        </Grid>
    );
};

export default ProjectCard;
