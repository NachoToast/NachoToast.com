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
import { useNavigate } from 'react-router-dom';
import { MouseEvent } from 'react';
import { TileType } from './Home';

const Tile = ({ tile, index }: { tile: TileType; index: number }) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const notSmall = useMediaQuery(theme.breakpoints.up('sm'));

    function handleClick(event: MouseEvent) {
        event.preventDefault();
        if (tile?.destination) {
            navigate(tile.destination);
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
                            image={tile.imageSource}
                            alt={tile.imageAlt}
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

export default Tile;
