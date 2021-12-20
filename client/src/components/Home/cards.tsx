import projectsPicture from '../../assets/projectCardImages/projectsPicture.png';
import minecraftLobbyPicture from '../../assets/projectCardImages/minecraftPicture.png';
import resourcesPicture from '../../assets/projectCardImages/resourcesPicture.png';
import gamesPicture from '../../assets/projectCardImages/gamesPicture.png';
import discordBotsPicture from '../../assets/projectCardImages/discordBotsPicture.png';

export interface ProjectCard {
    name: string;
    imageSource?: string;
    imageAlt?: string;
    destination?: string;
}

// TODO: people can leave ratings on cards, highest rating/most viewed (maybe select which one) are displayed first
// that might also be better to do for the 'ALl Projects' thing only

const projectCards: ProjectCard[] = [
    {
        name: 'Minecraft',
        imageSource: minecraftLobbyPicture,
        imageAlt:
            'A Minecraft screenshot of an old server lobby, showcasing a close-up of 3 trees under the sun.',
    },
    {
        name: 'All Projects',
        imageSource: projectsPicture,
        imageAlt:
            'A picture containing icons, code snippets, and other miscellaneous assets from my various projects.',
    },
    {
        name: 'Resources',
        imageSource: resourcesPicture,
        imageAlt:
            'A picture containing screenshots and other snippets from various code walkthroughs on the website.',
        destination: '/Resources',
    },
    {
        name: 'Games',
        imageSource: gamesPicture,
        imageAlt:
            "A collation of various image assets from my game Ignominy, such as a sword, a map of the kingdom 'Ignoma', and pixel art of a beer jug.",
    },
    {
        name: 'Discord Bots',
        imageSource: discordBotsPicture,
        imageAlt:
            'Various profile pictures of my Discord bots: CovidBot, NachoBot, MC Server Bot, and Jukebot.',
    },
    {
        name: 'Other',
    },
];

export default projectCards;
