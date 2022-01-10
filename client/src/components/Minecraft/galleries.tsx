import { Typography } from '@mui/material';
import { daeaniCastleImages } from '../../assets/images/minecraft/daeani_castle';
import { honeyHouseImages } from '../../assets/images/minecraft/honey_house';
import { seasonOneLobbyImages } from '../../assets/images/minecraft/lobby';
import { miscProjects } from '../../assets/images/minecraft/misc_projects';
import Image from '../../types/Image';

export enum GalleryNames {
    minecraft,
}

const galleryMap: {
    sourceImages: Image[];
    title: string;
    description: JSX.Element;
}[] = [
    {
        sourceImages: seasonOneLobbyImages,
        title: 'Season 1 Lobby',
        description: (
            <Typography>
                Season 1 of the Minecraft server was an anarchy world. A large spawn lobby was
                constructed in the desert as a safe-haven for new players.
                <br />
                It had various features, such as a massive underground fishing area, a multi-level
                library, and even a (hidden) nightclub.
            </Typography>
        ),
    },
    {
        sourceImages: daeaniCastleImages,
        title: "Daeani's Castle",
        description: (
            <Typography>
                In season 1 many incredible structures were built, and a significant portion of them
                were made by resident god-tier builder Daeani. This castle was one of the first
                displayed, stationed on top of a mountain it features complex towers, turrets, and
                architecture.
            </Typography>
        ),
    },
    {
        sourceImages: honeyHouseImages,
        title: "Honey's House",
        description: (
            <Typography>
                Server regular HoneyCrumble's house made in the season 1 anarchy world. It was later
                griefed :(
            </Typography>
        ),
    },
    {
        sourceImages: miscProjects,
        title: 'Other Projects',
        description: (
            <Typography>
                Miscellaneous, smaller builds ranging from server members houses to giant statues.
            </Typography>
        ),
    },
];

export default galleryMap;
