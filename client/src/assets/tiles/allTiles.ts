import { Tile } from '../../types/tile';
import projectsPicture from '../images/projectCardImages/projectsPicture.png';
import minecraftLobbyPicture from '../images/projectCardImages/minecraftPicture.png';
import resourcesPicture from '../images/projectCardImages/resourcesPicture.png';
import gamesPicture from '../images/projectCardImages/gamesPicture.png';
import discordBotsPicture from '../images/projectCardImages/discordBotsPicture.png';

export const minecraftTile: Tile = {
    name: 'Minecraft',
    imageSource: minecraftLobbyPicture,
    imageAlt:
        'A Minecraft screenshot of an old server lobby, showcasing a close-up of 3 trees under the sun.',
};

export const allProjectsTile: Tile = {
    name: 'All Projects',
    imageSource: projectsPicture,
    imageAlt:
        'A picture containing icons, code snippets, and other miscellaneous assets from my various projects.',
};

export const resourcesTile: Tile = {
    name: 'Resources',
    imageSource: resourcesPicture,
    imageAlt:
        'A picture containing screenshots and other snippets from various code walkthroughs on the website.',
    destination: '/resources',
};

export const gamesTile: Tile = {
    name: 'Games',
    imageSource: gamesPicture,
    imageAlt:
        "A collation of various image assets from my game Ignominy, such as a sword, a map of the kingdom 'Ignoma', and pixel art of a beer jug.",
};

export const discordBotsTile: Tile = {
    name: 'Discord Bots',
    imageSource: discordBotsPicture,
    imageAlt:
        'Various profile pictures of my Discord bots: CovidBot, NachoBot, MC Server Bot, and Jukebot.',
};

export const otherTile: Tile = {
    name: 'Other',
    destination: '/pog',
};
