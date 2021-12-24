import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import StoreState from '../state';

export interface State {
    titleText: string;
    inTransition: boolean;
    latestOverride: number;
    hideTitle: boolean;
}

export const initialState: State = {
    titleText: '     ',
    inTransition: false,
    latestOverride: 0,
    hideTitle: false,
};

const mainSlice = createSlice({
    name: 'main',
    initialState,
    reducers: {
        setTitle(state, action: { type: string; payload: string }) {
            state.titleText = action.payload;
        },
        setInTransition(state, action: { type: string; payload: boolean }) {
            state.inTransition = action.payload;
        },
        setLatestOverride(state, action: { type: string; payload: number }) {
            state.latestOverride = action.payload;
        },
        setHideTitle(state, action: { type: string; payload: boolean }) {
            state.hideTitle = action.payload;
        },
    },
});

export const { setTitle, setInTransition, setLatestOverride, setHideTitle } = mainSlice.actions;

export default mainSlice.reducer;

export const getTitle = (state: StoreState): string => state.main.titleText;

export const getInTransition = (state: StoreState): boolean => state.main.inTransition;

export const getLatestOverride = (state: StoreState): number => state.main.latestOverride;

export const getHideTitle = (state: StoreState): boolean => state.main.hideTitle;

async function resolveAfterSomeTime(x: number = 100) {
    // this is an alternative to
    // const wait = promisify(useTimeout)
    // which doesn't seem to work client-side :(
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve();
        }, x);
    });
}

export const interpolateTitle = createAsyncThunk(
    `main/interpolateTitle`,
    async (newTitle: string, { getState, dispatch }) => {
        const state = getState() as StoreState;
        const inTransition = getInTransition(state);
        const currentTitle = getTitle(state);
        const thisOverride = Date.now();

        if (inTransition) {
            dispatch(setLatestOverride(thisOverride));
        } else {
            dispatch(setInTransition(true));
        }

        // trim the current title until it matches the new one
        let index = currentTitle.length;
        let currentSubstring = currentTitle.slice(0, index);
        let newSubstring = newTitle.slice(0, index);
        while (currentSubstring !== newSubstring && index) {
            index--;
            currentSubstring = currentTitle.slice(0, index);
            // console.log(currentSubstring);
            newSubstring = newTitle.slice(0, index);
            dispatch(setTitle(currentSubstring));
            await resolveAfterSomeTime();
            const isOverridden = getLatestOverride(getState() as StoreState);
            if (isOverridden > thisOverride) return;
        }

        // append the current title with characters from the new one
        index++;
        while (index <= newTitle.length) {
            // console.log(newTitle.slice(0, index));
            dispatch(setTitle(newTitle.slice(0, index)));
            await resolveAfterSomeTime();
            const isOverridden = getLatestOverride(getState() as StoreState);
            if (isOverridden > thisOverride) return;
            index++;
        }

        await resolveAfterSomeTime();
        const isOverridden = getLatestOverride(getState() as StoreState);
        if (isOverridden > thisOverride) return;
        dispatch(setInTransition(false));
        dispatch(setLatestOverride(0));
    },
);
