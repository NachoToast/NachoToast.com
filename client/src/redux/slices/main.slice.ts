import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import StoreState from '../state';

export interface State {
    titleText: string;
    inTransition: boolean;
}

export const initialState: State = {
    titleText: 'Nach',
    inTransition: false,
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
    },
});

export const { setTitle, setInTransition } = mainSlice.actions;

export default mainSlice.reducer;

export const getTitle = (state: StoreState): string => state.main.titleText;

export const getInTransition = (state: StoreState): boolean => state.main.inTransition;

async function resolveAfterSomeTime(x: number = 100) {
    // this is an alternative to
    // const wait = promisify(useTimeout)
    // which doesn't seem to work client-side :(
    return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, x);
    });
}

export const transitionTitle = createAsyncThunk(
    `main/transitionTitle`,
    async (newTitle: string, { getState, dispatch }) => {
        const state = getState() as StoreState;
        const inTransition = getInTransition(state);
        const oldTitle = getTitle(state);

        if (oldTitle === newTitle) return;
        if (inTransition) {
            await resolveAfterSomeTime(100);
            dispatch(transitionTitle(newTitle));
            return;
        }
        dispatch(setInTransition(true));

        for (let i = oldTitle.length - 1; i >= 0; i--) {
            dispatch(setTitle(oldTitle.slice(0, i) + '_'));
            await resolveAfterSomeTime();
        }

        for (let i = 1, len = newTitle.length; i < len; i++) {
            dispatch(setTitle(newTitle.slice(0, i) + '_'));
            await resolveAfterSomeTime();
        }

        dispatch(setTitle(newTitle));
        dispatch(setInTransition(false));
    },
);
