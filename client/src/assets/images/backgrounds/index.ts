import homePage from './homePage.png';
import mafiaHomeScreen from './mafiaHomeScreen.png';
import nachoBotRconModule from './nachoBotRconModule.png';
import fractal from './fractal.png';
import { lobbyBenchDay } from '../minecraft/lobby';

const allCodePages = [homePage, mafiaHomeScreen, nachoBotRconModule];

export function randomBackground(): string {
    const randNum = Math.random();
    const roll = Math.floor(randNum * 100) + 1; // 1 to 100 (inclusive)
    if (roll === 1) return fractal;
    return allCodePages[Math.floor(randNum * allCodePages.length)];
}

export enum BackgroundMapKeys {
    minecraft,
}

export const backgroundMap: { [key in BackgroundMapKeys]: () => string } = {
    [BackgroundMapKeys.minecraft]: () => lobbyBenchDay.source,
};
