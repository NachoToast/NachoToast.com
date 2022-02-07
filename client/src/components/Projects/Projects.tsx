import { Container, Grid, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
    covidbotProfilePicture,
    ignominyPicture,
    jukebotProfilePicture,
    nachobotProfilePicture,
} from '../../assets/images/tileImages/allProjects';
import { interpolateTitle } from '../../redux/slices/main.slice';
import { TileType } from '../Home/Home';
import Tile from '../Home/Tile';

const tiles: TileType[] = [
    {
        name: 'Jukebot',
        imageSource: jukebotProfilePicture,
        imageAlt: "Jukebot's Discord profile picture",
    },
    {
        name: 'Nachobot',
        imageSource: nachobotProfilePicture,
        imageAlt: "Nachobot's Discord profile picture",
    },
    {
        name: 'NZ Covid Bot',
        imageSource: covidbotProfilePicture,
        imageAlt: "NZ Covid Bot's Discord profile picture",
    },
    {
        name: 'Ignominy',
        imageSource: ignominyPicture,
        imageAlt: 'A pixel-art drawing of a sword',
    },
    {
        name: 'LSB Discord Bot',
        imageSource: '',
        imageAlt: '',
    },
    {
        name: 'Website',
        imageSource: '',
        imageAlt: '',
    },
    {
        name: 'Mafia',
        imageSource: '',
        imageAlt: '',
    },
    {
        name: 'NachoMusic',
        imageSource: '',
        imageAlt: '',
    },
];

const Projects = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(interpolateTitle('My Projects'));
    }, [dispatch]);

    return (
        <Container sx={{ alignItems: 'center', justifyContent: 'center' }}>
            <Typography textAlign="center" variant="h4" gutterBottom>
                Project Details Coming Soon
            </Typography>
            <Grid container spacing={3} columns={12}>
                {tiles.map((tile, index) => (
                    <Tile tile={tile} index={index} key={index} />
                ))}
            </Grid>
        </Container>
    );
};

export default Projects;
