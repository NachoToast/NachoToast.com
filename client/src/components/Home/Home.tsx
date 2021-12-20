import { Container } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { transitionTitle } from '../../redux/slices/main.slice';
import {
    getCurrentTiles,
    SelectedTileList,
    setSelectedTileIndex,
    setSelectedTileList,
} from '../../redux/slices/tiles.slice';
import TileContainer from '../TileContainer/TileContainer';
import Title from '../Title/Title';

const Home = ({ tileList, newTitle }: { tileList?: SelectedTileList; newTitle: string }) => {
    const dispatch = useDispatch();
    const tiles = useSelector(getCurrentTiles);

    useEffect(() => {
        if (tileList) {
            dispatch(setSelectedTileIndex(-1));
            dispatch(setSelectedTileList(tileList));
        }
        if (newTitle) {
            dispatch(transitionTitle(newTitle));
        }
        return () => {};
    }, [tileList, newTitle, dispatch]);

    return (
        <Container
            style={{
                height: '100vh',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Title />
            <TileContainer tiles={tiles} />
        </Container>
    );
};

export default Home;
