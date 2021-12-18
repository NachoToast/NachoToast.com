import projectsPicture from '../../assets/projectCardImages/projectsPicture.png';
import { LobbyImages } from '../../assets/minecraft';

export interface ProjectCard {
    name: string;
    description: string;
    imageSource?: any;
    imageAlt?: string;
}

// TODO: people can leave ratings on cards, highest rating/most viewed (maybe select which one) are displayed first
// that might also be better to do for the 'ALl Projects' thing only

const projectCards: ProjectCard[] = [
    {
        name: 'Minecraft',
        description: 'An overview of the NachoToast Minecraft server.',
        imageSource: () => LobbyImages[Math.floor(Math.random() * LobbyImages.length)],
        imageAlt: 'A Minecraft screenshot of an old server lobby, showcasing the builds within.',
    },
    {
        name: 'All Projects',
        description: 'See all my past, current, and future projects!',
        imageSource: projectsPicture,
        imageAlt:
            'A picture containing icons, code snippets, and other miscellaneous assets from my various projects.',
    },
    {
        name: 'Dijkstra',
        description: 'Pathfinding algorithm.',
    },
    {
        name: 'Colour Tools',
        description: 'Colour palette generation tool.',
    },
    {
        name: 'Games',
        description: "Games I've made.",
    },
    {
        name: 'Discord Bots',
        description: 'All my Discord bots.',
    },
    {
        name: 'Links',
        description: 'Links to a bunch of stuff.',
    },
];

export default projectCards;
