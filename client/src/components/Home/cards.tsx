import projectsPicture from '../../assets/projectCardImages/projectsPicture.png';
import minecraftLobbyPicture from '../../assets/projectCardImages/minecraftPicture.png';

export interface ProjectCard {
    name: string;
    imageSource?: any;
    imageAlt?: string;
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
        name: 'Miscellaneous',
    },
    {
        name: 'Games',
    },
    {
        name: 'Discord Bots',
    },
    {
        name: 'Links',
    },
];

export default projectCards;
