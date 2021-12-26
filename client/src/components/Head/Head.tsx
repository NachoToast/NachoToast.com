import React from 'react';
import { Helmet } from 'react-helmet';

export interface HeadProps {
    /** The 'name' of the tab */
    title?: string;

    description?: string;

    /** Always use '%PUBLIC_URL%/path/to/file.png' */
    image?: string;

    /** Hex string.
     * @example #FFFFFF
     */
    themeColour?: string;

    url?: string;
}

const Head = ({ title, description, image, themeColour, url }: HeadProps) => {
    return (
        <Helmet>
            {!!title && <meta property="og:title" content={title} />}
            {!!title && <title>{title}</title>}

            {!!description && <meta property="og:description" content={description} />}
            {!!description && <meta name="description" content={description} />}

            {!!image && <meta property="og:image" content={image} />}

            {!!themeColour && <meta name="theme-color" content={themeColour} />}

            {!!url && <meta property="og:url" content={url} />}
        </Helmet>
    );
};

export default Head;
