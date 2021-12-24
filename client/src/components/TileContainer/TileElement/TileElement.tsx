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
import githubProfile from '../../../assets/images/projectCardImages/githubProfile.png';
import { Tile } from '../../../types/tile';
import { useDispatch, useSelector } from 'react-redux';
import { getSelectedTileIndex, setSelectedTileIndex } from '../../../redux/slices/tiles.slice';
import { useNavigate } from 'react-router-dom';
import { MouseEvent } from 'react';

const TileElement = ({ tile, index }: { tile: Tile; index: number }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const selectedTileIndex = useSelector(getSelectedTileIndex);

    const shouldFadeOut = selectedTileIndex !== -1 && selectedTileIndex !== index;

    const theme = useTheme();
    const notSmall = useMediaQuery(theme.breakpoints.up('sm'));

    function handleClick(event: MouseEvent) {
        dispatch(setSelectedTileIndex(index));
        event.preventDefault();
        if (tile?.destination) {
            navigate(tile.destination);
        }
    }

    return (
        <Grid item xs={12} sm={6} md={4} lg={3}>
            <Fade
                in={!shouldFadeOut}
                timeout={{ enter: 1000, exit: 1000 }}
                style={{ transitionDelay: `${400 * Math.random() + index ** 2 * 10}ms` }}
            >
                <Card className="projectCard" style={{ height: '100%' }} onClick={handleClick}>
                    <CardActionArea>
                        <CardMedia
                            component="img"
                            image={tile?.imageSource || githubProfile}
                            alt={
                                tile?.imageAlt ||
                                `The default photo, NachoToast's github profile picture.`
                            }
                            style={{ display: notSmall ? 'unset' : 'none' }}
                        />
                        <CardContent>
                            <Typography align="center" variant="h4">
                                {tile.name}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Fade>
        </Grid>
    );
};

export default TileElement;
