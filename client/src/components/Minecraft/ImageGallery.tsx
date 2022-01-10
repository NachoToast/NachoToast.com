import {
    Grid,
    ImageList,
    ImageListItem,
    Typography,
    Stack,
    Tooltip,
    Button,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import { useEffect, useState } from 'react';
import galleryMap from './galleries';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

import LooksOneIcon from '@mui/icons-material/LooksOne';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import Looks3Icon from '@mui/icons-material/Looks3';
import Looks4Icon from '@mui/icons-material/Looks4';
import Looks5Icon from '@mui/icons-material/Looks5';
import FadedImage from '../Misc/FadedImage';

const numberIcons = [
    <LooksOneIcon />,
    <LooksTwoIcon />,
    <Looks3Icon />,
    <Looks4Icon />,
    <Looks5Icon />,
];

const ImageGallery = () => {
    const [cols, setCols] = useState(1);

    const [prevGalleryIndex, setPrevGalleryIndex] = useState(galleryMap.length - 1);
    const [galleryIndex, setGalleryIndex] = useState(0);
    const [nextGalleryIndex, setNextGalleryIndex] = useState(1);

    function changeGalleryIndex(modifier: 1 | -1): void {
        let current = galleryIndex;
        current += modifier;
        current %= galleryMap.length;

        if (current < 0) current = galleryMap.length - 1;
        setGalleryIndex(current);
        setNextGalleryIndex((current + 1) % galleryMap.length);
        setPrevGalleryIndex(current - 1 < 0 ? galleryMap.length - 1 : current - 1);
    }

    useEffect(() => {
        function handleKeyPress(e: KeyboardEvent) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                changeGalleryIndex(-1);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                changeGalleryIndex(1);
            }
        }

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [galleryIndex]);

    const { title, description, sourceImages } = galleryMap[galleryIndex];

    return (
        <Grid item xs={12}>
            <Stack id="galleryBar" direction="row">
                <Typography variant="h4" flexGrow={1} gutterBottom>
                    {title}
                </Typography>
                <Tooltip
                    title={`Previous Gallery (${prevGalleryIndex + 1}/${galleryMap.length})`}
                    placement="top"
                >
                    <Button
                        onClick={(e) => {
                            e.preventDefault();
                            changeGalleryIndex(-1);
                        }}
                    >
                        <ArrowBackIosIcon />
                    </Button>
                </Tooltip>
                <Tooltip
                    title={`Next Gallery (${nextGalleryIndex + 1}/${galleryMap.length})`}
                    placement="top"
                >
                    <Button
                        onClick={(e) => {
                            e.preventDefault();
                            changeGalleryIndex(1);
                        }}
                    >
                        <ArrowForwardIosIcon />
                    </Button>
                </Tooltip>
                <Tooltip title="Change Number of Columns" placement="top">
                    <Button
                        onClick={(e) => {
                            e.preventDefault();
                            setCols((cols + 1) % 5);
                        }}
                    >
                        {numberIcons[cols]}
                    </Button>
                </Tooltip>
            </Stack>
            {description}
            <ImageList cols={cols + 1}>
                {sourceImages.map(({ source, alt }, index) => (
                    <Tooltip title={<Typography>{alt}</Typography>} key={`${source}${index}`}>
                        <ImageListItem>
                            <FadedImage src={source} alt={alt} style={{ width: '100%' }} />
                        </ImageListItem>
                    </Tooltip>
                ))}
            </ImageList>
        </Grid>
    );
};

export default ImageGallery;
