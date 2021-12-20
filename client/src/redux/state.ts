import { State as TilesState } from './slices/tiles.slice';
import { State as MainState } from './slices/main.slice';

export default interface StoreState {
    tiles: TilesState;
    main: MainState;
}
