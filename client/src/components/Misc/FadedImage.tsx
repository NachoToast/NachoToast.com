// an image that fades in once it loads
import { Fade } from '@mui/material';
import { ImgHTMLAttributes, SyntheticEvent, useState } from 'react';

const FadedImage = (props: ImgHTMLAttributes<HTMLImageElement> & { alt: string; src: string }) => {
    const [loaded, setLoaded] = useState(false);

    function handleLoad(e: SyntheticEvent<HTMLImageElement, Event>) {
        e.preventDefault();
        setLoaded(true);
    }

    return (
        <Fade in={loaded}>
            <img {...props} alt={props.alt} src={props.src} onLoad={handleLoad} />
        </Fade>
    );
};

export default FadedImage;
