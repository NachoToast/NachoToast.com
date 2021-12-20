import { Grid } from '@mui/material';
import { Tile } from '../../types/tile';
import TileElement from './TileElement/TileElement';

const TileContainer = ({ tiles }: { tiles: Tile[] }) => {
    return (
        <Grid container spacing={3} columns={12}>
            {tiles.map((tile, index) => (
                <TileElement tile={tile} index={index} key={`${tile.name}${index}`} />
            ))}
        </Grid>
    );
};

export default TileContainer;
