import { Tile } from '../../types/tile';
import {
    allProjectsTile,
    discordBotsTile,
    gamesTile,
    minecraftTile,
    otherTile,
    resourcesTile,
} from './allTiles';

export const mainTiles: Tile[] = [
    minecraftTile,
    allProjectsTile,
    resourcesTile,
    gamesTile,
    discordBotsTile,
    otherTile,
];

export const resourcesTiles: Tile[] = [resourcesTile, otherTile, discordBotsTile];
