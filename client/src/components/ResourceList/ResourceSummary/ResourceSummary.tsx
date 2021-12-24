import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionItem from '../../../types/AccordionItem';
import { AccordionSummary, Fade, Stack, Typography, useMediaQuery } from '@mui/material';
import NewPage from './ResourceIcons/NewPage';
import { useTheme } from '@mui/system';
import LinkPage from './ResourceIcons/LinkPage';
import { useEffect, useState } from 'react';
import OldPage from './ResourceIcons/OldPage';

const ResourceSummary = ({
    resource,
    expanded,
    navLink,
}: {
    resource: AccordionItem;
    expanded: boolean;
    navLink: string;
}) => {
    const { name, nameIconPrefix, navigatesTo, element, description, unlinkable, ancient } =
        resource;

    const theme = useTheme();
    const notSmall = useMediaQuery(theme.breakpoints.up('sm'));

    const showOpenInNewPageIcon = !!navigatesTo && !!element;
    const showDescription = notSmall && !!description;

    const [actionArray, setActionArray] = useState<JSX.Element[]>([]);
    const [fadeIndex, setFadeIndex] = useState<number>(0);

    useEffect(() => {
        const newActionArray: JSX.Element[] = [];

        // open in new page button
        if (!!navigatesTo && !!element) {
            newActionArray.push(<NewPage navigatesTo={navigatesTo} />);
        }

        // make link to page button
        if (!unlinkable) {
            newActionArray.push(<LinkPage linkToMake={navLink} />);
        }

        if (ancient) {
            newActionArray.push(<OldPage />);
        }

        setActionArray(newActionArray);
        setFadeIndex(-1);
    }, [ancient, element, navLink, navigatesTo, unlinkable]);

    useEffect(() => {
        if (!expanded) {
            setFadeIndex(0);
            return;
        }
        if (actionArray.length < 2 || !expanded) return;
        let myInterval: NodeJS.Timeout;
        if (fadeIndex < actionArray.length) {
            myInterval = setInterval(() => {
                setFadeIndex(fadeIndex + 1);
            }, 100);
        }
        return () => {
            clearInterval(myInterval);
        };
    }, [actionArray.length, expanded, fadeIndex, name]);

    return (
        <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ overflow: 'hidden', justifyContent: 'flex-start' }}
        >
            <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
                {!!nameIconPrefix && nameIconPrefix}
                <Typography>{name}</Typography>
                <Fade in={expanded}>
                    <Stack direction="row" spacing={1}>
                        {actionArray.map((e, i) => (
                            <Fade in={fadeIndex >= i && expanded} key={i}>
                                <span>{e}</span>
                            </Fade>
                        ))}
                    </Stack>
                </Fade>
                {showDescription && (
                    <Typography
                        noWrap
                        textAlign="right"
                        sx={{ color: 'text.secondary', flexGrow: 1, pr: 2 }}
                    >
                        {description}
                    </Typography>
                )}
            </Stack>
        </AccordionSummary>
    );
};

export default ResourceSummary;
