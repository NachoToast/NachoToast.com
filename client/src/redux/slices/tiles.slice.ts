import { createSlice } from '@reduxjs/toolkit';
import { mainTiles, resourcesTiles } from '../../assets/tiles/tileLists';
import { Tile } from '../../types/tile';
import StoreState from '../state';

export interface State {
    tileLists: {
        [key: string]: Tile[];
    };
    selectedTileList: SelectedTileList;
    selectedTileIndex: number;
}

export type SelectedTileList = keyof State['tileLists'] | -1;

export const initialState: State = {
    tileLists: {
        mainTiles,
        resourcesTiles,
    },
    selectedTileList: 'mainTiles',
    selectedTileIndex: -1,
};

const tilesSlice = createSlice({
    name: 'tiles',
    initialState,
    reducers: {
        setSelectedTileIndex(state, action: { type: string; payload: number }) {
            state.selectedTileIndex = action.payload;
        },
        setSelectedTileList(state, action: { type: string; payload: SelectedTileList }) {
            state.selectedTileList = action.payload;
            state.selectedTileIndex = -1;
        },
    },
});

export const { setSelectedTileIndex, setSelectedTileList } = tilesSlice.actions;

export default tilesSlice.reducer;

export const getCurrentTiles = (state: StoreState): Tile[] => {
    if (state.tiles.selectedTileList === -1) return [];
    return state.tiles.tileLists[state.tiles.selectedTileList];
};

export const getSelectedTileIndex = (state: StoreState): number => state.tiles.selectedTileIndex;

export const getAllTileLists = (state: StoreState): string[] => Object.keys(state.tiles.tileLists);
