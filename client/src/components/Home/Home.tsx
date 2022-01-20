import { Container, Grid } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { interpolateTitle } from '../../redux/slices/main.slice';
import * as pictures from '../../assets/images/tileImages';
import Tile from './Tile';

export interface TileType {
    name: string;
    imageSource: string;
    imageAlt: string;
    destination?: string;
}

const tiles: TileType[] = [
    {
        name: 'Minecraft',
        imageSource: pictures.minecraftPicture,
        imageAlt:
            'A Minecraft screenshot of an old server lobby, showcasing a close-up of 3 trees under the sun.',
        destination: '/minecraft',
    },
    // {
    //     name: 'All Projects',
    //     imageSource: pictures.projectsPicture,
    //     imageAlt:
    //         'A picture containing icons, code snippets, and other miscellaneous assets from my various projects.',
    // },
    {
        name: 'Resources',
        imageSource: pictures.resourcesPicture,
        imageAlt:
            'A picture containing screenshots and other snippets from various code walkthroughs on the website.',
        destination: '/resources',
    },
    // {
    //     name: 'Games',
    //     imageSource: pictures.gamesPicture,
    //     imageAlt:
    //         "A collation of various image assets from my game Ignominy, such as a sword, a map of the kingdom 'Ignoma', and pixel art of a beer jug.",
    // },
    // {
    //     name: 'Discord Bots',
    //     imageSource: pictures.discordBotsPicture,
    //     imageAlt:
    //         'Various profile pictures of my Discord bots: CovidBot, NachoBot, MC Server Bot, and Jukebot.',
    // },
];

const Home = ({ newTitle }: { newTitle?: string }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (newTitle) {
            dispatch(interpolateTitle(newTitle));
        }
        return () => {};
    }, [newTitle, dispatch]);

    return (
        <Container
            style={{
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Grid container spacing={3} columns={12}>
                {tiles.map((tile, index) => (
                    <Tile tile={tile} index={index} key={`${tile.name}${index}`} />
                ))}
            </Grid>
        </Container>
    );
};

export default Home;
